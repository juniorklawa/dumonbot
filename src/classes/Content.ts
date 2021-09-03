import { IContent } from '../models/IContent';
import { ISentence } from '../models/ISentence';

export class Content implements IContent {
  constructor(
    public sourceContentOriginal: string,
    public sourceContentSanitized: string,
    public sentences: ISentence[],
    public searchTerm: string,
    public downloadedImagesLinks: string[],
    public articleSource: string,
    public contentThumb: string,
  ) {}
}
