import { Content } from '../../classes/Content';
import ImagesService from '../../services/ImageService';
import FakeCustomSearchProvider from '../fakes/FakeCustomSearchProvider';
import FakeImageDownloaderProvider from '../fakes/FakeImageDownloaderProvider';

describe('ImageService', () => {
  const mockedContent: Content = require('../mocks/content_working.json');
  const content = new Content(
    mockedContent.sourceContentOriginal,
    mockedContent.sourceContentSanitized,
    mockedContent.sentences.map(sentence => ({
      ...sentence,
      googleSearchQuery: '',
      imagesLinks: [],
    })),
    mockedContent.searchTerm,
    [],
    mockedContent.articleSource,
  );

  const fakeCustomSearchProvider = new FakeCustomSearchProvider();
  const fakeImageDownloaderProvider = new FakeImageDownloaderProvider();

  const imageService = new ImagesService(
    content,
    fakeCustomSearchProvider,
    fakeImageDownloaderProvider,
  );

  test('should update images queries of all sentences', async () => {
    imageService.fetchImagesQueriesOfAllSentences();
    expect(content.sentences[0].googleSearchQuery).toBeTruthy();
  });

  test('should fetch google images links from all sentences', async () => {
    await imageService.fetchGoogleImagesLinks();
    expect(content.sentences[0].imagesLinks[0]).toBe(
      'https://i.ytimg.com/vi/I8jf8muKbEA/maxresdefault.jpg',
    );
  });

  test('should download all images', async () => {
    jest.spyOn(imageService, 'downloadAndSave');

    await imageService.downloadAllImages();

    expect(imageService.downloadAndSave).toHaveBeenCalledTimes(24);
  });

  test('should remove all images', async () => {
    jest.spyOn(imageService, 'removeImages');

    imageService.removeImages();

    expect(imageService.removeImages).toHaveBeenCalledTimes(1);
  });
});
