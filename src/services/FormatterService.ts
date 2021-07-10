import sentenceBoundaryDetection from 'sbd';
import NaturalLanguageUnderstandingV1 from 'watson-developer-cloud/natural-language-understanding/v1.js';
import { Content } from '../classes/Content';

export interface ISentence {
  text: string;
  keywords: string[];
  images: string[];
}

export interface IContent {
  sourceContentOriginal: string;
  sourceContentSanitized: string;
  sentences: ISentence[];
  searchTerm: string;
}

interface IKeyword {
  text: string;
}

export class FormatterService {
  content: Content;
  constructor(content: Content) {
    this.content = content;
  }

  sanitizeContent() {
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

    const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(
      this.content.sourceContentOriginal,
    );
    const withoutDatesInParentheses = removeDatesInParentheses(
      withoutBlankLinesAndMarkdown,
    );
    this.content.sourceContentSanitized = withoutDatesInParentheses;
  }

  breakContentIntoSentences() {
    const sentences = sentenceBoundaryDetection.sentences(
      this.content.sourceContentSanitized,
    );
    sentences.forEach(sentence => {
      this.content.sentences.push({
        text: sentence,
        keywords: [],
        images: [],
      });
    });
  }

  filterSentencesLength() {
    const filteredSenteces = this.content.sentences.filter(
      sentence =>
        sentence.text.length <= 280 && sentence.text.split(' ').length > 1,
    );

    this.content.sentences = filteredSenteces;
  }

  summaryzeSentences() {
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

    this.content.sentences = [...intro, ...middle, ...conclusionFiltered];
  }

  fetchWatsonAndReturnKeywords(sentence: string): Promise<string[]> {
    const nlu = new NaturalLanguageUnderstandingV1({
      iam_apikey: 'HGr6XiPti7IQyiqSSOsu8MPnBqyTe486onezeYN0H1ao',
      version: '2018-04-05',
      url:
        'https://api.us-south.natural-language-understanding.watson.cloud.ibm.com/instances/e3add662-9269-4321-962a-5dba77629ae0',
    });

    return new Promise((resolve, reject) => {
      nlu.analyze(
        {
          text: sentence,
          features: {
            keywords: {},
          },
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error: string, response: any) => {
          if (error) {
            reject(error);
            return;
          }

          const keywords = response.keywords.map((keyword: IKeyword) => {
            return keyword.text;
          });

          resolve(keywords);
        },
      );
    });
  }

  async fetchKeywordsOfAllSentences() {
    console.log('> [text-robot] Starting to fetch keywords from Watson');

    // eslint-disable-next-line no-restricted-syntax
    for await (const sentence of this.content.sentences) {
      console.log(`> [text-robot] Sentence: "${sentence.text}"`);

      sentence.keywords = await this.fetchWatsonAndReturnKeywords(sentence.text);

      console.log(`> [text-robot] Keywords: ${sentence.keywords.join(', ')}\n`);
    }
  }
}
