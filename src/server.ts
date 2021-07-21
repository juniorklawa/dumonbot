import { Content } from './classes/Content';
import { ContentService } from './services/ContentService';
import { FormatterService } from './services/FormatterService';
import { ImagesService } from './services/ImageService';
import { ThreadService } from './services/ThreadService';
import * as dotenv from 'dotenv';
import { Stepper } from './classes/Stepper';
import { SubjectOfTheDayService } from './services/SubjectOfTheDayService';

async function run() {
  dotenv.config();

  const subjectOfTheDayService = new SubjectOfTheDayService();

  const subject = await subjectOfTheDayService.getSubjectOfTheDay();

  const content = new Content('', '', [], subject, []);
  const contentService = new ContentService(content);
  const formatterService = new FormatterService(content);
  const imageService = new ImagesService(content);
  const threadService = new ThreadService(content);

  const stepper = new Stepper(
    contentService,
    formatterService,
    imageService,
    threadService,
  );

  await stepper.execute();
}

run();
