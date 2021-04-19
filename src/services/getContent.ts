import 'dotenv/config';
import sentenceBoundaryDetection from 'sbd';
import NaturalLanguageUnderstandingV1 from 'watson-developer-cloud/natural-language-understanding/v1.js';

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

const getContent = async (content: IContent): Promise<IContent> => {
  console.log('> [getContent] Starting...');

  const fetchContent = async () => {
    try {
      const Algorithmia = require('algorithmia');

      const input = {
        articleName: content.searchTerm,
        lang: 'pt',
      };
      const wikipediaContent = await Algorithmia.client(
        'simWAGm/BHtzl7wND8EsGzo0RKd1',
      )
        .algo('web/WikipediaParser/0.1.2?timeout=300')
        .pipe(input);

      content.sourceContentOriginal = wikipediaContent.get().summary;

      console.log('> [getContent] Fetching done!');
    } catch (e) {
      throw new Error(e);
    }
  };

  const sanitizeContent = () => {
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
      content.sourceContentOriginal,
    );
    const withoutDatesInParentheses = removeDatesInParentheses(
      withoutBlankLinesAndMarkdown,
    );
    content.sourceContentSanitized = withoutDatesInParentheses;
  };

  const breakContentIntoSentences = () => {
    const sentences = sentenceBoundaryDetection.sentences(
      content.sourceContentSanitized,
    );
    sentences.forEach(sentence => {
      content.sentences.push({
        text: sentence,
        keywords: [],
        images: [],
      });
    });
  };

  const filterSentencesLength = () => {
    const filteredSenteces = content.sentences.filter(
      sentence =>
        sentence.text.length <= 280 && sentence.text.split(' ').length > 1,
    );

    content.sentences = filteredSenteces;
  };

  const summaryzeSentences = () => {
    const sentencesChunk = content.sentences.length / 3;

    const intro = content.sentences.slice(0, sentencesChunk).slice(0, 4);

    const middle = content.sentences
      .slice(sentencesChunk, sentencesChunk * 2)
      .slice(0, 4);

    const conclusionGroup = content.sentences.slice(
      sentencesChunk * 2,
      sentencesChunk * 3,
    );

    const conclusionFiltered = conclusionGroup.slice(
      conclusionGroup.length - 4,
    );

    content.sentences = [...intro, ...middle, ...conclusionFiltered];
  };

  const fetchWatsonAndReturnKeywords = (
    sentence: string,
  ): Promise<string[]> => {
    const nlu = new NaturalLanguageUnderstandingV1({
      iam_apikey: 'HGr6XiPti7IQyiqSSOsu8MPnBqyTe486onezeYN0H1ao',
      version: '2018-04-05',
      url:
        'https://gateway.watsonplatform.net/natural-language-understanding/api/',
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
  };

  async function fetchKeywordsOfAllSentences() {
    console.log('> [text-robot] Starting to fetch keywords from Watson');

    // eslint-disable-next-line no-restricted-syntax
    for await (const sentence of content.sentences) {
      console.log(`> [text-robot] Sentence: "${sentence.text}"`);

      sentence.keywords = await fetchWatsonAndReturnKeywords(sentence.text);

      console.log(`> [text-robot] Keywords: ${sentence.keywords.join(', ')}\n`);
    }
  }

  await fetchContent();
  sanitizeContent();
  breakContentIntoSentences();
  filterSentencesLength();
  summaryzeSentences();
  await fetchKeywordsOfAllSentences();

  return content;
};

export default getContent;
