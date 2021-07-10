import { google } from 'googleapis';
import { Content } from '../classes/Content';



export class ImagesService {
  content: Content;
  constructor(content: Content) {
    this.content = content;
  }

  async fetchImagesOfAllSentences() {
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
  }

  async fetchGoogleAndReturnImagesLinks(query: string) {
    const customSearch = google.customsearch('v1');

    const response = await customSearch.cse.list({
      auth: 'AIzaSyABX74azEv9VM9s9atuwah5RhIxt3tzgfA',
      cx: 'c2e106af226bc6c10',
      q: query,
      searchType: 'image',
      num: 2,
    });

    const { data } = response;

    if (data.items) {
      const imagesUrl = data.items.map(item => {
        return item.link;
      });

      return imagesUrl;
    }
  }

  async downloadAllImages() {
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
            throw new Error('Image already downloaded');
          }

          await this.downloadAndSave(imageUrl, `${sentenceIndex}-original.png`);
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
  }

  async downloadAndSave(url: string, fileName: string) {
    const imageDownloader = require('image-downloader');

    return imageDownloader.image({
      url,
      dest: `./content/${fileName}`,
    });
  }
}
