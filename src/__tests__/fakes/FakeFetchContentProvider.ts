import { Content } from '../../classes/Content';
import IFetchContentProvider from '../../classes/interfaces/IFetchContentProvider';

export default class FakeFetchContentProvider implements IFetchContentProvider {
  async fetch(_searchTerm: string, _language: string): Promise<any> {
    const mockedContent: Content = require('../mocks/content_working.json');

    try {
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
    } catch (err: any) {
      throw new Error(err);
    }
  }
}
