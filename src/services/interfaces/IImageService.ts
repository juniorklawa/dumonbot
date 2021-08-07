export interface IImageService {
  fetchImagesQueriesOfAllSentences(): Promise<void>;
  fetchGoogleImagesLinks(): Promise<string[] | null>;

  downloadAllImages(): Promise<void>;

  downloadAndSave(url: string, fileName: string): Promise<any>;

  removeImages(): void;
}
