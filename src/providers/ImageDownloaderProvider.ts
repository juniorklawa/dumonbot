import IImageDownloaderProvider from '../classes/interfaces/IImageDownloaderProvider';

export default class ImageDownloaderProvider
  implements IImageDownloaderProvider {
  async downloadImage(url: string, filename: string): Promise<void> {
    try {
      const imageDownloader = require('image-downloader');

      await imageDownloader.image({
        url,
        dest: `./content/${filename}`,
      });
    } catch (err: any) {
      throw new Error(err);
    }
  }
}
