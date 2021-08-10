import sentenceBoundaryDetection, { sentences } from 'sbd';
import NaturalLanguageUnderstandingV1 from 'watson-developer-cloud/natural-language-understanding/v1.js';
import { Content } from '../classes/Content';
import { ISentence } from '../models/ISentence';
import { IFormatterService } from './interfaces/IFormatterService';

export class FormatterService implements IFormatterService {
  constructor(private content: Content) {}

  sanitizeContent(): void {
    console.log('> [Formatter Service] Sanitizing content...');
    const removeDatesInParentheses = (text: string) => {
      return text
        .replace(/\((?:\([^()]*\)|[^()])*\)/gm, '')
        .replace(/ {2}/g, ' ');
    };

    const removeBlankLinesAndMarkdown = (text: string) => {
      const allLines = text.split('\n');
      const withoutBlankLinesAndMarkdown = allLines.filter(line => {
        if (line.trim().length === 0 || line.trim().startsWith('=')) {
          return false;
        }
        return true;
      });
      return withoutBlankLinesAndMarkdown.join(' ');
    };

    console.log('> [Formatter Service] Removing Blank lines and markdown...');
    const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(
      this.content.sourceContentOriginal,
    );

    console.log('> [Formatter Service] Removing Dates in parentheses...');
    const withoutDatesInParentheses = removeDatesInParentheses(
      withoutBlankLinesAndMarkdown,
    );
    this.content.sourceContentSanitized = withoutDatesInParentheses;
  }

  breakContentIntoSentences(): void {
    console.log('> [Formatter Service] Breaking content into sentences...');
    const sentences = sentenceBoundaryDetection.sentences(
      this.content.sourceContentSanitized,
    );
    sentences.forEach(sentence => {
      this.content.sentences.push({
        text: sentence,
        keywords: [],
        imagesLinks: [],
        googleSearchQuery: '',
      });
    });
  }

  filterSentencesLength(): void {
    console.log('> [Formatter Service] Filtering sentences length...');
    const filteredSenteces = this.content.sentences.filter(
      sentence =>
        sentence.text.length <= 280 && sentence.text.split(' ').length > 1,
    );

    this.content.sentences = filteredSenteces;
  }

  summaryzeSentences(): void {
    console.log('> [Formatter Service] Summaryzing sentences...');
    const sentencesChunk = this.content.sentences.length / 3;

    const intro = this.content.sentences.slice(0, sentencesChunk).slice(0, 4);

    const middle = this.content.sentences
      .slice(sentencesChunk, sentencesChunk * 2)
      .slice(0, 4);

    const conclusionGroup = this.content.sentences.slice(
      sentencesChunk * 2,
      sentencesChunk * 3,
    );

    const conclusionFiltered = conclusionGroup.slice(
      conclusionGroup.length - 4,
    );

    const introSentence = {
      text: `🧶A thread de hoje será sobre: ${this.content.searchTerm}\n\nSegue o fio...👇`,
    } as ISentence;

    const lastSentence = {
      text: `📚 Fonte: ${this.content.articleSource}\n\nGostou? me siga para todo dia ter uma thread nova sobre algum assunto aleatório gerado por mim, o DumonBot 🤖\n\n🔗 Quer sugerir algum tema? Entre em www.dumonbot.netlify.com`,
    } as ISentence;

    this.content.sentences = [
      introSentence,
      ...intro,
      ...middle,
      ...conclusionFiltered,
      lastSentence,
    ];
  }

  fetchWatsonAndReturnKeywords(sentence: string): Promise<string[]> {
    try {
      const nlu = new NaturalLanguageUnderstandingV1({
        iam_apikey: process.env.WATSON_KEY,
        version: '2018-04-05',
        url: process.env.NLU_URL,
      });

      return new Promise((resolve, reject) => {
        nlu.analyze(
          {
            text: sentence,
            features: {
              keywords: {},
            },
          },

          (error: string, response) => {
            if (error) {
              reject(error);
              return;
            }

            const keywords = response?.keywords?.map(keyword => {
              return keyword.text;
            });

            resolve(keywords as string[]);
          },
        );
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async fetchKeywordsOfAllSentences(): Promise<void> {
    try {
      console.log(
        '> [Formatter Service] Starting to fetch keywords from Watson...',
      );

      // eslint-disable-next-line no-restricted-syntax
      for await (const [
        sentenceIndex,
        sentence,
      ] of this.content.sentences.entries()) {
        console.log(`> [Formatter Service] Sentence: "${sentence.text}"`);

        if (sentenceIndex !== sentences.length - 1) {
          sentence.keywords = await this.fetchWatsonAndReturnKeywords(
            sentence.text,
          );

          console.log(
            `> [Formatter Service] Keywords: ${sentence.keywords.join(', ')}\n`,
          );
        }
      }
    } catch (err) {
      throw new Error(err);
    }
  }
}
