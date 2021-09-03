export default interface IFetchContentProvider {
  fetch(searchTerm: string, language: string): Promise<any>;
}
