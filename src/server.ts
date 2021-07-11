import { Content } from './classes/Content';
import { ContentService } from './services/ContentService';
import { FormatterService } from './services/FormatterService';
import { ImagesService } from './services/ImageService';
import { ThreadService } from './services/ThreadService';
import * as dotenv from 'dotenv';

async function run() {
  dotenv.config();

  const content = new Content('', '', [], 'Poodle', []);
  const contentService = new ContentService(content);
  const formatterService = new FormatterService(content);
  const imageService = new ImagesService(content);
  const threadService = new ThreadService(content);

  await contentService.fetchContent();
  formatterService.sanitizeContent();
  formatterService.breakContentIntoSentences();
  formatterService.filterSentencesLength();
  formatterService.summaryzeSentences();
  await formatterService.fetchKeywordsOfAllSentences();
  await imageService.fetchImagesOfAllSentences();
  await imageService.downloadAllImages();
  await threadService.generateThread();
}

run();
