import NaturalLanguageUnderstandingV1 from 'watson-developer-cloud/natural-language-understanding/v1.js';
import IFetchKeywordsProvider from '../classes/interfaces/IFetchKeywordsProvider';

export default class FetchKeywordsProvider implements IFetchKeywordsProvider {
  async fetchKeywords(sentence: string): Promise<string[]> {
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
    } catch (err: any) {
      throw new Error(err);
    }
  }
}
