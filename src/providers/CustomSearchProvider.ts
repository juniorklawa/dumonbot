import { google } from 'googleapis';
import ICustomSearchProvider from '../interfaces/ICustomSearchProvider';

export default class CustomSearchProvider implements ICustomSearchProvider {
  async getSearchResult(googleSearchQuery: string): Promise<unknown> {
    const customSearch = google.customsearch('v1');

    const response = await customSearch.cse.list({
      auth: process.env.CUSTOM_SEARCH_AUTH,
      cx: process.env.CUSTOM_SEARCH_CX,
      q: googleSearchQuery,
      searchType: 'image',
      safe: 'active',
      num: 2,
    });

    return response;
  }
}
