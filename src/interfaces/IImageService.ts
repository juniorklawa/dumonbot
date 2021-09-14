export interface IImageService {
  fetchImagesQueriesOfAllSentences(): void;
  fetchGoogleImagesLinks(): Promise<string[] | null>;
  downloadAllImages(): Promise<void>;
  downloadAndSave(url: string, fileName: string): Promise<void>;
  removeDuplicates(): Promise<void>;
  removeImages(): void;
}
