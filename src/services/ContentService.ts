import { IContentService } from '../interfaces/IContentService';
import IFetchContentProvider from '../interfaces/IFetchContentProvider';
import { IContent } from '../models/IContent';

export default class ContentService implements IContentService {
  constructor(
    private content: IContent,
    private fetchContentProvider: IFetchContentProvider,
  ) {}

  async fetchContent(): Promise<void> {
    console.log('> [Content Service] Starting...');
    console.log(
      `> [Content Service] Fetching random content: ${this.content.searchTerm}`,
    );

    const doc = await this.fetchContentProvider.fetch(
      this.content.searchTerm,
      'pt',
    );

    this.content.sourceContentOriginal = doc.sections()[0].text();
    this.content.articleSource = doc.url();

    console.log('> [Content Service] Fetching done!');
  }
}
