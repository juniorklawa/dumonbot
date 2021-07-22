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

      // const Algorithmia = require('algorithmia');

      // const input = {
      //   articleName: this.content.searchTerm,
      //   lang: 'pt',
      // };
      // const wikipediaContent = await Algorithmia.client(
      //   process.env.ALGORITHMIA_KEY,
      // )
      //   .algo('web/WikipediaParser/0.1.2?timeout=300')
      //   .pipe(input);

      console.log('> [getContent] Fetching done!');
    } catch (e) {
      throw new Error(e);
    }
  }
}
