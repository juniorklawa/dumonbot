export default interface IImageDownloaderProvider {
  downloadImage(url: string, filename: string): Promise<void>;
}
