export default interface ICustomSearchProvider {
  getSearchResult(googleSearchQuery: string): Promise<any>;
}
