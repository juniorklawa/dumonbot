import { Content } from '../classes/Content';
import { IContentService } from './interfaces/IContentService';

export class ContentService implements IContentService {
  constructor(private content: Content) {}

  async fetchContent(): Promise<void> {
    console.log('> [Content Service] Starting...');
    try {
      const wtf = require('wtf_wikipedia');

      console.log(
        `> [Content Service] Fetching random content: ${this.content.searchTerm}`,
      );
      const doc = await wtf.fetch(this.content.searchTerm, 'pt');

      this.content.sourceContentOriginal = doc.sections()[0].text();
      this.content.articleSource = doc.url();
      console.log('> [Content Service] Fetching done!');
    } catch (e) {
      throw new Error(e);
    }
  }
}
