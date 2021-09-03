import { Content } from '../classes/Content';
import FetchContentProvider from '../providers/FetchContentProvider';
import { IContentService } from '../interfaces/IContentService';

export default class ContentService implements IContentService {
  constructor(
    private content: Content,
    private fetchContentProvider: FetchContentProvider,
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
