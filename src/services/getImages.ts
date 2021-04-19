import { google } from 'googleapis';
import { IContent } from './getContent';

const customSearch = google.customsearch('v1');

const getImages = async (content: IContent): Promise<IContent> => {
  console.log('> [image-robot] Starting...');
  await fetchImagesOfAllSentences();
  await downloadAllImages();

  async function fetchImagesOfAllSentences() {
    for (
      let sentenceIndex = 0;
      sentenceIndex < content.sentences.length;
      sentenceIndex++
    ) {
      let query;

      if (sentenceIndex === 0) {
        query = `${content.searchTerm}`;
      } else {
        query = `${content.searchTerm} ${content.sentences[sentenceIndex].keywords[0]}`;
      }

      console.log(`> [image-robot] Querying Google Images with: "${query}"`);

      content.sentences[
        sentenceIndex
      ].images = await fetchGoogleAndReturnImagesLinks(query);
      content.sentences[sentenceIndex].googleSearchQuery = query;
    }
  }

  async function fetchGoogleAndReturnImagesLinks(query) {
    const response = await customSearch.cse.list({
      auth: 'AIzaSyABX74azEv9VM9s9atuwah5RhIxt3tzgfA',
      cx: 'c2e106af226bc6c10',
      q: query,
      searchType: 'image',
      num: 2,
    });

    const imagesUrl = response.data.items.map(item => {
      return item.link;
    });

    console.log('uepa');

    return imagesUrl;
  }

  async function downloadAllImages() {
    content.downloadedImages = [];

    for (
      let sentenceIndex = 0;
      sentenceIndex < content.sentences.length;
      sentenceIndex++
    ) {
      const { images } = content.sentences[sentenceIndex];

      for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
        const imageUrl = images[imageIndex];

        try {
          if (content.downloadedImages.includes(imageUrl)) {
            throw new Error('Image already downloaded');
          }

          await downloadAndSave(imageUrl, `${sentenceIndex}-original.png`);
          content.downloadedImages.push(imageUrl);
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

  async function downloadAndSave(url: string, fileName: string) {
    const imageDownloader = require('image-downloader');

    return imageDownloader.image({
      url,
      dest: `./content/${fileName}`,
    });
  }

  return content;
};

export default getImages;
