import { Content } from '../../classes/Content';
import ContentService from '../../services/ContentService';
import FormatterService from '../../services/FormatterService';
import ImagesService from '../../services/ImageService';
import StepperService from '../../services/StepperService';

import ThreadService from '../../services/ThreadService';
import FakeCustomSearchProvider from '../fakes/FakeCustomSearchProvider';
import FakeFetchContentProvider from '../fakes/FakeFetchContentProvider';
import FakeImageDownloaderProvider from '../fakes/FakeImageDownloaderProvider';
import FakeFetchKeywordsProvider from '../fakes/FakeKeywordsProvider';

jest.mock('../../services/ContentService');
jest.mock('../../services/FormatterService');
jest.mock('../../services/ImageService');
jest.mock('../../services/ThreadService');

describe('StepperService', () => {
  test('should run steps in a right order', async () => {
    const fakeFetchContentProvider = new FakeFetchContentProvider();
    const fakeFetchKeywordsProvider = new FakeFetchKeywordsProvider();
    const fakeCustomSearchProvider = new FakeCustomSearchProvider();
    const fakeImageDownloaderProvider = new FakeImageDownloaderProvider();

    const mockedContent: Content = require('../mocks/content_working.json');
    const content = new Content(
      mockedContent.sourceContentOriginal,
      mockedContent.sourceContentSanitized,
      mockedContent.sentences,
      mockedContent.searchTerm,
      mockedContent.downloadedImagesLinks,
      mockedContent.articleSource,
    );

    const contentService = new ContentService(
      content,
      fakeFetchContentProvider,
    );
    const formatterService = new FormatterService(
      content,
      fakeFetchKeywordsProvider,
    );
    const imageService = new ImagesService(
      content,
      fakeCustomSearchProvider,
      fakeImageDownloaderProvider,
    );
    const threadService = new ThreadService(content);

    const stepper = new StepperService(
      contentService,
      formatterService,
      imageService,
      threadService,
    );

    jest.spyOn(contentService, 'fetchContent');

    jest.spyOn(formatterService, 'sanitizeContent');
    jest.spyOn(formatterService, 'breakContentIntoSentences');
    jest.spyOn(formatterService, 'filterSentencesLength');
    jest.spyOn(formatterService, 'summaryzeSentences');
    jest.spyOn(formatterService, 'fetchKeywordsOfAllSentences');

    jest.spyOn(imageService, 'fetchImagesQueriesOfAllSentences');
    jest.spyOn(imageService, 'fetchGoogleImagesLinks');
    jest.spyOn(imageService, 'downloadAllImages');

    jest
      .spyOn(threadService, 'generateThread')
      .mockImplementation(() => Promise.resolve());

    jest.spyOn(imageService, 'removeImages');

    await stepper.execute();

    expect(contentService.fetchContent).toBeCalledTimes(1);

    expect(formatterService.sanitizeContent).toBeCalledTimes(1);
    expect(formatterService.breakContentIntoSentences).toBeCalledTimes(1);
    expect(formatterService.filterSentencesLength).toBeCalledTimes(1);
    expect(formatterService.summaryzeSentences).toBeCalledTimes(1);
    expect(formatterService.fetchKeywordsOfAllSentences).toBeCalledTimes(1);

    expect(imageService.fetchImagesQueriesOfAllSentences).toBeCalledTimes(1);
    expect(imageService.fetchGoogleImagesLinks).toBeCalledTimes(1);
    expect(imageService.downloadAllImages).toBeCalledTimes(1);

    expect(threadService.generateThread).toBeCalledTimes(1);

    expect(imageService.removeImages).toBeCalledTimes(1);
  });
});
