import IFetchKeywordsProvider from '../../interfaces/IFetchKeywordsProvider';

export default class FakeFetchKeywordsProvider
  implements IFetchKeywordsProvider {
  async fetchKeywords(_sentence: string): Promise<string[]> {
    return new Promise(resolve => {
      resolve(['foo', 'bar']);
    });
  }
}
