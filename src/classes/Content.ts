import { IContent } from '../interfaces/IContent';
import { ISentence } from '../interfaces/ISentence';

export default class Content implements IContent {
  constructor(
    public sourceContentOriginal: string,
    public sourceContentSanitized: string,
    public sentences: ISentence[],
    public searchTerm: string,
    public downloadedImagesLinks: string[],
    public imageHashes: string[],
    public articleSource: string,
  ) {}
}
