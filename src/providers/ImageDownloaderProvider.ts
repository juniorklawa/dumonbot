import IImageDownloaderProvider from '../interfaces/IImageDownloaderProvider';

export default class ImageDownloaderProvider
  implements IImageDownloaderProvider {
  async downloadImage(url: string, filename: string): Promise<void> {
    const imageDownloader = require('image-downloader');

    await imageDownloader.image({
      url,
      dest: `./content/${filename}`,
    });
  }
}
