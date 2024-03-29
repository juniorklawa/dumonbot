import { ISentence } from './ISentence';

export interface IContent {
  sourceContentOriginal: string;
  sourceContentSanitized: string;
  sentences: ISentence[];
  downloadedImagesLinks: string[];
  searchTerm: string;
  articleSource: string;
  imageHashes: string[];
}
