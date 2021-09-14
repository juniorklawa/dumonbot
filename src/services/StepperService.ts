import { IStepper } from '../interfaces/IStepper';
import { IContentService } from '../interfaces/IContentService';
import { IFormatterService } from '../interfaces/IFormatterService';
import { IImageService } from '../interfaces/IImageService';
import { IThreadService } from '../interfaces/IThreadService';

export default class StepperService implements IStepper {
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
      this.imageService.fetchImagesQueriesOfAllSentences();
      await this.imageService.fetchGoogleImagesLinks();
      await this.imageService.downloadAllImages();
      await this.imageService.removeDuplicates();
      await this.threadService.generateThread();
      // this.imageService.removeImages();
    } catch (err) {
      console.error(err);
    }
  }
}
