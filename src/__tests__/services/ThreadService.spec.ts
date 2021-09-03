import { Content } from '../../classes/Content';
import { ICreatedTweet } from '../../models/ICreatedTweet';
import ThreadService from '../../services/ThreadService';

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

    const threadService = new ThreadService(content);

    jest.spyOn(threadService, 'answerPrevTweet').mockImplementation(() => {
      return {} as Promise<ICreatedTweet>;
    });

    await threadService.generateThread();
  });
});
