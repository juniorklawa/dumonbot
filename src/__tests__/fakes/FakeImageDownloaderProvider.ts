import IImageDownloaderProvider from '../../interfaces/IImageDownloaderProvider';

export default class FakeImageDownloaderProvider
  implements IImageDownloaderProvider {
  async downloadImage(_url: string, _filename: string): Promise<void> {
    return Promise.resolve();
  }
}
