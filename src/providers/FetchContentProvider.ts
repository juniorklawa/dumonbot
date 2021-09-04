import IFetchContentProvider from '../interfaces/IFetchContentProvider';
import { IWikipediaDoc } from '../interfaces/IWikipediaDoc';

export default class FetchContentProvider implements IFetchContentProvider {
  async fetch(searchTerm: string, language: string): Promise<IWikipediaDoc> {
    const wikipediaService = require('wtf_wikipedia');
    const doc = await wikipediaService.fetch(searchTerm, language);
    return doc;
  }
}
