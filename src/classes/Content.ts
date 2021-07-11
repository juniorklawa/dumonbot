export class Content {
  constructor(
    public sourceContentOriginal: string,
    public sourceContentSanitized: string,
    public sentences: any[],
    public searchTerm: string,
    public downloadedImages: any[],
  ) {}
}
