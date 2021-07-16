import { ISentence } from './ISentence';

export interface IContent {
  sourceContentOriginal: string;
  sourceContentSanitized: string;
  sentences: ISentence[];
  searchTerm: string;
}
