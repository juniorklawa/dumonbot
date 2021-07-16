import { IContentService } from '../services/interfaces/IContentService';
import { IFormatterService } from '../services/interfaces/IFormatterService';
import { IImageService } from '../services/interfaces/IImageService';
import { IThreadService } from '../services/interfaces/IThreadService';
import { IStepper } from './interfaces/IStepper';

export class Stepper implements IStepper {
  constructor(
    private contentService: IContentService,
    private formatterService: IFormatterService,
    private imageService: IImageService,
    private threadService: IThreadService,
  ) {}

  async execute(): Promise<void> {
    try {
      await this.contentService.fetchContent();
      this.formatterService.sanitizeContent();
      this.formatterService.breakContentIntoSentences();
      this.formatterService.filterSentencesLength();
      this.formatterService.summaryzeSentences();
      await this.formatterService.fetchKeywordsOfAllSentences();
      await this.imageService.fetchImagesOfAllSentences();
      await this.imageService.downloadAllImages();
      await this.threadService.generateThread();
    } catch (err) {
      console.error(err);
    }
  }
}
