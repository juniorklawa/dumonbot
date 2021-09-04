import Content from '../../classes/Content';
import ThreadService from '../../services/ThreadService';
import FakeTwitterProvider from '../fakes/FakeTwitterProvider';

describe('ThreadService', () => {
  test('should generate a thread', async () => {
    const mockedContent: Content = require('../mocks/content_working.json');
    const content = new Content(
      mockedContent.sourceContentOriginal,
      mockedContent.sourceContentSanitized,
      mockedContent.sentences,
      mockedContent.searchTerm,
      mockedContent.downloadedImagesLinks,
      mockedContent.articleSource,
    );

    const fakeTwitterProvider = new FakeTwitterProvider();

    const threadService = new ThreadService(content, fakeTwitterProvider);

    // jest.spyOn(threadService, 'answerPrevTweet').mockImplementation(() => {
    //   return {} as Promise<ICreatedTweet>;
    // });

    await threadService.generateThread();
  });
});
