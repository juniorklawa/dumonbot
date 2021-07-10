export class Content {
  sourceContentOriginal: string;
  sourceContentSanitized: string;
  sentences: any[];
  downloadedImages: any[];
  searchTerm: string;

  constructor(
    sourceContentOriginal: string,
    sourceContentSanitized: string,
    sentences: any[],
    searchTerm: string,
    downloadedImages: any[],
  ) {
    this.sourceContentOriginal = sourceContentOriginal;
    this.sourceContentSanitized = sourceContentSanitized;
    this.sentences = sentences;
    this.searchTerm = searchTerm;
    this.downloadedImages = downloadedImages;
  }
}
