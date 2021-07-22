export interface IImageService {
  fetchImagesOfAllSentences(): Promise<void>;
  fetchGoogleAndReturnImagesLinks(query: string): Promise<string | null>;

  downloadAllImages(): Promise<void>;

  downloadAndSave(url: string, fileName: string): Promise<any>;

  removeImages(): void;
}
