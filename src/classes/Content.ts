import { ISentence } from '../models/ISentence';

export class Content {
  constructor(
    public sourceContentOriginal: string,
    public sourceContentSanitized: string,
    public sentences: ISentence[],
    public searchTerm: string,
    public downloadedImagesLinks: string[],
  ) {}
}
