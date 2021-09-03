import { IWikipediaDoc } from './IWikipediaDoc';

export default interface IFetchContentProvider {
  fetch(searchTerm: string, language: string): Promise<IWikipediaDoc>;
}
