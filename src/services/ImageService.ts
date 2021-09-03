import { Content } from '../classes/Content';
import {
  ICustomSearchData,
  ICustomSearchItem,
} from '../interfaces/ICustomSearchData';
import { IImageService } from '../interfaces/IImageService';
import CustomSearchProvider from '../providers/CustomSearchProvider';
import ImageDownloaderProvider from '../providers/ImageDownloaderProvider';
export default class ImagesService implements IImageService {
  constructor(
    private content: Content,
    private customSearchProvider: CustomSearchProvider,
    private imageDownloaderProvider: ImageDownloaderProvider,
  ) {}

  fetchImagesQueriesOfAllSentences(): void {
    console.log(
      `> [Image Service] Fetching images queries of all sentences...`,
    );

    for (const [index] of this.content.sentences.entries()) {
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
  }

  async fetchGoogleImagesLinks(): Promise<string[] | null> {
    console.log(`> [Image Service] Fetching Google images links...`);

    for await (const [index, sentence] of this.content.sentences.entries()) {
      if (index !== this.content.sentences.length - 1) {
        const response = await this.customSearchProvider.getSearchResult(
          sentence.googleSearchQuery,
        );

        const { data } = response as ICustomSearchData;
        if (data.items) {
          const imagesUrl = data.items.map((item: ICustomSearchItem) => {
            return item.link;
          });

          this.content.sentences[index].imagesLinks = imagesUrl as string[];
        }
      }
    }

    return null;
  }

  async downloadAllImages(): Promise<void> {
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
  }

  async downloadAndSave(url: string, fileName: string): Promise<void> {
    const fs = require('fs');
    const dir = './content';

    if (!fs.existsSync(dir)) {
      await fs.mkdirSync(dir);
    }

    await this.imageDownloaderProvider.downloadImage(url, fileName);
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
