import { google } from 'googleapis';
import { Content } from '../classes/Content';
import { IImageService } from './interfaces/IImageService';

export class ImagesService implements IImageService {
  constructor(private content: Content) {}

  async fetchImagesQueriesOfAllSentences(): Promise<void> {
    try {
      console.log(
        `> [Image Service] Fetching images queries of all sentences...`,
      );

      for await (const [index] of this.content.sentences.entries()) {
        if (index !== this.content.sentences.length - 1) {
          let query;

          if (index === 0) {
            query = `${this.content.searchTerm}`;
          } else if (index === 1) {
            query = `${this.content.searchTerm} ${this.content.sentences[index].keywords[1]}`;
          } else {
            query = `${this.content.searchTerm} ${this.content.sentences[index].keywords[0]}`;
          }

          console.log(
            `> [Image Service] Querying Google Images with: "${query}"`,
          );

          this.content.sentences[index].googleSearchQuery = query;
        }
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  async fetchGoogleImagesLinks(): Promise<string[] | null> {
    try {
      console.log(`> [Image Service] Fetching Google images links...`);
      const customSearch = google.customsearch('v1');

      for await (const [index, sentence] of this.content.sentences.entries()) {
        if (index !== this.content.sentences.length - 1) {
          const response = await customSearch.cse.list({
            auth: process.env.CUSTOM_SEARCH_AUTH,
            cx: process.env.CUSTOM_SEARCH_CX,
            q: sentence.googleSearchQuery,
            searchType: 'image',
            num: 2,
          });

          const { data } = response;

          if (data.items) {
            const imagesUrl = data.items.map(item => {
              return item.link;
            });

            this.content.sentences[index].imagesLinks = imagesUrl as string[];
          }
        }
      }

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  async downloadAllImages(): Promise<void> {
    try {
      console.log(`> [Image Service] Downloading all images...`);
      this.content.downloadedImagesLinks = [];

      for await (const [sentenceIndex] of this.content.sentences.entries()) {
        if (sentenceIndex !== this.content.sentences.length - 1) {
          const { imagesLinks } = this.content.sentences[sentenceIndex];

          for await (const [imageIndex, imageUrl] of imagesLinks.entries()) {
            let imageDownloadUrl = imagesLinks[0];

            if (
              this.content.downloadedImagesLinks.includes(imageUrl) &&
              imagesLinks.length > 1
            ) {
              imageDownloadUrl = imagesLinks[1];
            }
            try {
              await this.downloadAndSave(
                imageDownloadUrl,
                `${sentenceIndex}-original.png`,
              );
              this.content.downloadedImagesLinks.push(imageDownloadUrl);
              console.log(
                `> [Image Service] [${sentenceIndex}][${imageIndex}] Image successfully downloaded: ${imageUrl}`,
              );
            } catch (error) {
              console.log(
                `> [Image Service] [${sentenceIndex}][${imageIndex}] Error (${imageDownloadUrl}): ${error}`,
              );
            }
          }
        }
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  async downloadAndSave(url: string, fileName: string): Promise<void> {
    try {
      const imageDownloader = require('image-downloader');

      const fs = require('fs');
      const dir = './content';

      if (!fs.existsSync(dir)) {
        await fs.mkdirSync(dir);
      }

      await imageDownloader.image({
        url,
        dest: `./content/${fileName}`,
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  removeImages(): void {
    const fs = require('fs');
    const path = require('path');

    const directory = 'content';

    fs.readdir(directory, (err: string, files: string[]) => {
      if (err) {
        throw err;
      }

      for (const file of files) {
        fs.unlink(path.join(directory, file), (err: string) => {
          if (err) {
            throw err;
          }
        });
      }
    });
  }
}
