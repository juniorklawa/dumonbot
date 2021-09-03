import IFetchContentProvider from '../classes/interfaces/IFetchContentProvider';

export default class FetchContentProvider implements IFetchContentProvider {
  async fetch(searchTerm: string, language: string): Promise<any> {
    const wikipediaService = require('wtf_wikipedia');
    const doc = await wikipediaService.fetch(searchTerm, language);
    return doc;
  }
}
