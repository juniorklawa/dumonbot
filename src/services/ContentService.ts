import { Content } from '../classes/Content';

export class ContentService {
  content: Content;
  constructor(content: Content) {
    this.content = content;
  }

  fetchContent = async () => {
    console.log('> [getContent] Starting...');

    try {
      const Algorithmia = require('algorithmia');

      const input = {
        articleName: this.content.searchTerm,
        lang: 'pt',
      };
      const wikipediaContent = await Algorithmia.client(
        'simWAGm/BHtzl7wND8EsGzo0RKd1',
      )
        .algo('web/WikipediaParser/0.1.2?timeout=300')
        .pipe(input);

      this.content.sourceContentOriginal = wikipediaContent.get().summary;

      console.log('> [getContent] Fetching done!');
    } catch (e) {
      throw new Error(e);
    }
  };
}
