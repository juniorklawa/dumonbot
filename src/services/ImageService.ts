import {
  ICustomSearchData,
  ICustomSearchItem,
} from '../interfaces/ICustomSearchData';
import ICustomSearchProvider from '../interfaces/ICustomSearchProvider';
import IImageDownloaderProvider from '../interfaces/IImageDownloaderProvider';
import { IImageService } from '../interfaces/IImageService';
import { IContent } from '../models/IContent';
import levenDistance from '../utils/levenDistance';
const fs = require('fs');
const path = require('path');
export default class ImagesService implements IImageService {
  constructor(
    private content: IContent,
    private customSearchProvider: ICustomSearchProvider,
    private imageDownloaderProvider: IImageDownloaderProvider,
  ) {}

  fetchImagesQueriesOfAllSentences(): void {
    console.log(
      `> [Image Service] Fetching images queries of all sentences...`,
    );

    for (const [index] of this.content.sentences.entries()) {
      if (index !== this.content.sentences.length - 1) {
        let query;

        if (index === 0) {
          query = `${this.content.searchTerm} image`;
        } else if (index === 1) {
          query = `${this.content.searchTerm} ${this.content.sentences[index].keywords[1]}`;
        } else {
          const filteredKeyword = this.content.sentences[index].keywords.find(
            keyword =>
              !this.content.sentences.some(sentence => {
                return (
                  `${this.content.searchTerm} ${keyword}` ===
                  sentence.googleSearchQuery
                );
              }) && keyword !== this.content.searchTerm,
          );

          query = `${this.content.searchTerm} ${filteredKeyword}`;
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

        const imageDownloadUrl = imagesLinks.find(
          imageLink => !this.content.downloadedImagesLinks.includes(imageLink),
        );

        if (imageDownloadUrl) {
          try {
            const fileName = `${sentenceIndex}-original.png`;

            await this.downloadAndSave(
              imageDownloadUrl?.replace('http://', 'https://'),
              fileName,
            );

            this.content.downloadedImagesLinks.push(imageDownloadUrl);
            await this.setImageHash(fileName);
            console.log(
              `> [Image Service] [${sentenceIndex}] Image successfully downloaded: ${imageDownloadUrl}`,
            );
          } catch (error) {
            console.log(
              `> [Image Service] [${sentenceIndex}] Error (${imageDownloadUrl}): ${error}`,
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

  async setImageHash(fileName: string): Promise<void> {
    const imghash = require('imghash');

    const imagePath = `./content/${fileName}`;

    const imageHash = await await imghash.hash(imagePath);

    this.content.imageHashes.push(imageHash);
  }

  async removeDuplicates(): Promise<void> {
    for (let i = 0; i < this.content.imageHashes.length; i++) {
      for (let j = i + 1; j < this.content.imageHashes.length; j++) {
        if (j !== i) {
          const distance = levenDistance(
            this.content.imageHashes[i],
            this.content.imageHashes[j],
          );

          if (distance <= 3) {
            const duplicatedImageUrl = this.content.downloadedImagesLinks[j];

            const duplicatedIndexArray = this.content.sentences.reduce(
              (acc, item, index: number) => {
                if (
                  item.imagesLinks?.some(
                    imageLink => imageLink === duplicatedImageUrl,
                  )
                ) {
                  // @ts-ignore
                  acc.push(index);
                }
                return acc;
              },
              [],
            );

            console.log(`> [Image Service] - Found removing duplicates`);
            duplicatedIndexArray.forEach((item, index) => {
              if (index !== 0) {
                this.removeOneImage(`${item}-original.png`);
              }
            });
          }
        }
      }
    }
  }

  removeOneImage(fileName: string): void {
    const directory = 'content';

    const filePath = path.join(directory, fileName.toString());
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err: string) => {
        if (err) {
          throw err;
        }
      });
    }
  }

  removeImages(): void {
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
