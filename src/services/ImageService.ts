import { google } from 'googleapis';
import { Content } from '../classes/Content';
import { IImageService } from './interfaces/IImageService';

export class ImagesService implements IImageService {
  constructor(private content: Content) {}

  async fetchImagesOfAllSentences(): Promise<void> {
    try {
      for (
        let sentenceIndex = 0;
        sentenceIndex < this.content.sentences.length;
        sentenceIndex++
      ) {
        let query;

        if (sentenceIndex === 0) {
          query = `${this.content.searchTerm}`;
        } else {
          query = `${this.content.searchTerm} ${this.content.sentences[sentenceIndex].keywords[0]}`;
        }

        console.log(`> [image-robot] Querying Google Images with: "${query}"`);

        this.content.sentences[
          sentenceIndex
        ].images = await this.fetchGoogleAndReturnImagesLinks(query);
        this.content.sentences[sentenceIndex].googleSearchQuery = query;
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  async fetchGoogleAndReturnImagesLinks(query: string): Promise<string | null> {
    try {
      const customSearch = google.customsearch('v1');

      const response = await customSearch.cse.list({
        auth: process.env.CUSTOM_SEARCH_AUTH,
        cx: process.env.CUSTOM_SEARCH_CX,
        q: query,
        searchType: 'image',
        num: 2,
      });

      const { data } = response;

      if (data.items) {
        const imagesUrl = data.items.map(item => {
          return item.link;
        });

        return (imagesUrl as unknown) as string;
      }

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  async downloadAllImages(): Promise<void> {
    try {
      this.content.downloadedImages = [];

      for (
        let sentenceIndex = 0;
        sentenceIndex < this.content.sentences.length;
        sentenceIndex++
      ) {
        const { images } = this.content.sentences[sentenceIndex];

        for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
          const imageUrl = images[imageIndex];

          try {
            if (this.content.downloadedImages.includes(imageUrl)) {
              return;
            }

            await this.downloadAndSave(
              imageUrl,
              `${sentenceIndex}-original.png`,
            );
            this.content.downloadedImages.push(imageUrl);
            console.log(
              `> [image-robot] [${sentenceIndex}][${imageIndex}] Image successfully downloaded: ${imageUrl}`,
            );
            break;
          } catch (error) {
            console.log(
              `> [image-robot] [${sentenceIndex}][${imageIndex}] Error (${imageUrl}): ${error}`,
            );
          }
        }
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  async downloadAndSave(url: string, fileName: string): Promise<any> {
    try {
      const imageDownloader = require('image-downloader');

      return imageDownloader.image({
        url,
        dest: `./content/${fileName}`,
      });
    } catch (err) {
      throw new Error(err);
    }
  }
}
