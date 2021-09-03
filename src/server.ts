import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import Content from './classes/Content';
import Subject from './models/Subject';
import CustomSearchProvider from './providers/CustomSearchProvider';
import FetchContentProvider from './providers/FetchContentProvider';
import FetchKeywordsProvider from './providers/FetchKeywordsProvider';
import ImageDownloaderProvider from './providers/ImageDownloaderProvider';
import TwitterProvider from './providers/TwitterProvider';
import ContentService from './services/ContentService';
import FormatterService from './services/FormatterService';
import ImagesService from './services/ImageService';
import StepperService from './services/StepperService';
import SubjectOfTheDayService from './services/SubjectOfTheDayService';
import ThreadService from './services/ThreadService';

async function run() {
  dotenv.config();

  mongoose.connect(process.env.MONGO_URL as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const subjectOfTheDayService = new SubjectOfTheDayService();

  const subject = await subjectOfTheDayService.getSubjectOfTheDay();
  console.log('[ server ] Today subject: ', subject.name);

  const fetchContentProvider = new FetchContentProvider();
  const fetchKeywordsProvider = new FetchKeywordsProvider();
  const customSearchProvider = new CustomSearchProvider();
  const imageDownloaderProvider = new ImageDownloaderProvider();
  const twitterProvider = new TwitterProvider();

  const content = new Content('', '', [], subject.name, [], '');
  const contentService = new ContentService(content, fetchContentProvider);
  const formatterService = new FormatterService(content, fetchKeywordsProvider);
  const imageService = new ImagesService(
    content,
    customSearchProvider,
    imageDownloaderProvider,
  );
  const threadService = new ThreadService(content, twitterProvider);

  const stepper = new StepperService(
    contentService,
    formatterService,
    imageService,
    threadService,
  );

  await Subject.findOneAndUpdate({ _id: subject._id }, { hasThread: true });

  await stepper.execute();
  process.exit(0);
}

run();
