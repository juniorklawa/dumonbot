export default interface IFetchKeywordsProvider {
  fetchKeywords(sentence: string): Promise<string[]>;
}
