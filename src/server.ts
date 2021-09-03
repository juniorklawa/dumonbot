import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Content } from './classes/Content';
import CustomSearchProvider from './providers/CustomSearchProvider';
import FetchContentProvider from './providers/FetchContentProvider';
import FetchKeywordsProvider from './providers/FetchKeywordsProvider';
import ImageDownloaderProvider from './providers/ImageDownloaderProvider';
import ContentService from './services/ContentService';
import  FormatterService  from './services/FormatterService';
import ImagesService from './services/ImageService';
import StepperService from './services/StepperService';
import SubjectOfTheDayService from './services/SubjectOfTheDayService';
import ThreadService from './services/ThreadService';

async function run() {
  dotenv.config();

  mongoose.connect(
    `mongodb+srv://admin:sqj140uUnEp63nww@cluster0.jxelo.gcp.mongodb.net/dumonbot?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  );

  const subjectOfTheDayService = new SubjectOfTheDayService();

  const subject = await subjectOfTheDayService.getSubjectOfTheDay();
  console.log('[ server ] Today subject: ', subject);

  // const storagedContent = require('../content_working.json');
  const fetchContentProvider = new FetchContentProvider();
  const fetchKeywordsProvider = new FetchKeywordsProvider();
  const customSearchProvider = new CustomSearchProvider();
  const imageDownloaderProvider = new ImageDownloaderProvider();

  const content = new Content('', '', [], subject, [], '');
  const contentService = new ContentService(content, fetchContentProvider);
  const formatterService = new FormatterService(content, fetchKeywordsProvider);
  const imageService = new ImagesService(
    content,
    customSearchProvider,
    imageDownloaderProvider,
  );
  const threadService = new ThreadService(content);

  const stepper = new StepperService(
    contentService,
    formatterService,
    imageService,
    threadService,
  );

  await stepper.execute();
  process.exit(0);
}

run();
