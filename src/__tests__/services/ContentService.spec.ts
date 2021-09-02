import { Content } from '../../classes/Content';
import ContentService from '../../services/ContentService';
import FakeFetchContentProvider from '../fakes/FakeFetchContentProvider';

describe('ContentService', () => {
  const fakeFetchContentProvider = new FakeFetchContentProvider();

  test('it should get article content and article source', async () => {
    const content = new Content('', '', [], 'China', [], '');
    const contentService = new ContentService(
      content,
      fakeFetchContentProvider,
    );
    await contentService.fetchContent();
    expect(content.articleSource).toBeTruthy();
    expect(content.sourceContentOriginal).toBeTruthy();
  });

  test('should thrown an error if something bad happens', async () => {
    try {
      const content = new Content('', '', [], 'China', [], '');
      const contentService = new ContentService(
        content,
        fakeFetchContentProvider,
      );
      await contentService.fetchContent();
      throw new Error('something bad happened');
    } catch (err: any) {
      expect(err.message).toEqual(`something bad happened`);
    }
  });
});
