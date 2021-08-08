import { Content } from '../classes/Content';
import { IContentService } from './interfaces/IContentService';

export class ContentService implements IContentService {
  constructor(private content: Content) {}

  async fetchContent(): Promise<void> {
    console.log('> [getContent] Starting...');
    try {
      const wtf = require('wtf_wikipedia');

      const doc = await wtf.fetch(this.content.searchTerm, 'pt');

      this.content.sourceContentOriginal = doc.sections()[0].text();
      this.content.articleSource = doc.url();
      console.log('> [getContent] Fetching done!');
    } catch (e) {
      throw new Error(e);
    }
  }
}
