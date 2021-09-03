import { Content } from '../../classes/Content';
import IFetchContentProvider from '../../interfaces/IFetchContentProvider';

export default class FakeFetchContentProvider implements IFetchContentProvider {
  async fetch(_searchTerm: string, _language: string): Promise<any> {
    const mockedContent: Content = require('../mocks/content_working.json');

    return {
      url: () => {
        return mockedContent.articleSource;
      },
      sections: () => {
        return [
          {
            text: () => {
              return mockedContent.sourceContentOriginal;
            },
          },
        ];
      },
    };
  }
}
