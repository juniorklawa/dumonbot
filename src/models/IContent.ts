import { ISentence } from './ISentence';

export interface IContent {
  sourceContentOriginal: string;
  sourceContentSanitized: string;
  sentences: ISentence[];
  contentThumb: string;
  searchTerm: string;
}
