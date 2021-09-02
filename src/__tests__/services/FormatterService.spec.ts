import { Content } from '../../classes/Content';
import { ISentence } from '../../models/ISentence';
import { FormatterService } from '../../services/FormatterService';

describe('FormatterService', () => {
  const mockedContent: Content = require('../mocks/content_working.json');
  const content = new Content(
    mockedContent.sourceContentOriginal,
    '',
    [],
    'Leonardo da Vinci',
    [],
    '',
  );

  const formatterService = new FormatterService(content);

  test('should sanitize content', async () => {
    formatterService.sanitizeContent();
    const sanitizedContent = content.sourceContentSanitized;
    expect(sanitizedContent).toBe(mockedContent.sourceContentSanitized);
  });

  test('should break content into sentences and summaryze it', async () => {
    formatterService.breakContentIntoSentences();
    formatterService.breakContentIntoSentences();
    formatterService.filterSentencesLength();
    formatterService.summaryzeSentences();
    const introSentence = {
      text: `🧶A thread de hoje será sobre: ${content.searchTerm}\n\nSegue o fio...👇`,
    } as ISentence;

    const lastSentence = {
      text: `📚 Fonte: ${content.articleSource}\n\nGostou? me siga para todo dia ter uma thread nova sobre algum assunto aleatório gerado por mim, o DumonBot 🤖\n\n🔗 Quer sugerir algum tema? Entre em www.dumonbot.netlify.com`,
    } as ISentence;

    const sentences = [...content.sentences].map((sentence: ISentence) => ({
      text: sentence.text,
    }));

    expect(sentences).toEqual(
      expect.arrayContaining([introSentence, lastSentence]),
    );
  });
});
