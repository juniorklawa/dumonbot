export interface IFormatterService {
  sanitizeContent(): void;
  breakContentIntoSentences(): void;
  filterSentencesLength(): void;
  summaryzeSentences(): void;
  fetchWatsonAndReturnKeywords(sentence: string): Promise<string[]>;
  fetchKeywordsOfAllSentences(): Promise<void>;
}
