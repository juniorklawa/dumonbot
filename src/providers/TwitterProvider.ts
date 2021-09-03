import ITwitterProvider from '../interfaces/ITwitterProvider';
import { ITweetData } from '../services/ThreadService';

export default class TwitterProvider implements ITwitterProvider {
  async post(method: string, data: unknown): Promise<ITweetData> {
    const Twit = require('twit');

    const T = new Twit({
      consumer_key: process.env.TWIT_CONSUMER_KEY,
      consumer_secret: process.env.TWIT_CONSUMER_SECRET,
      access_token: process.env.TWIT_ACCESS_TOKEN,
      access_token_secret: process.env.TWIT_ACCESS_TOKEN_SECRET,
      timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
      strictSSL: true, // optional - requires SSL certificates to be valid.
    });

    return new Promise((resolve, reject) => {
      T.post(method, data, (err: string, data: ITweetData) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(data);
      });
    });
  }
}
