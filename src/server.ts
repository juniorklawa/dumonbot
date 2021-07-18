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

  const content = new Content('', '', [], 'Krakatoa', []);
  const contentService = new ContentService(content);
  const formatterService = new FormatterService(content);
  const imageService = new ImagesService(content);
  const threadService = new ThreadService(content);

  const subjectOfTheDay = new SubjectOfTheDayService();

  await subjectOfTheDay.getSubjectOfTheDay();

  const stepper = new Stepper(
    contentService,
    formatterService,
    imageService,
    threadService,
  );

  await stepper.execute();
}

run();
