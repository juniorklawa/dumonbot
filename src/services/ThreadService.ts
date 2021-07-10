import { Content } from '../classes/Content';

interface ICreatedTweet {
  id_str: string;
  id: number;
  text: string;
}

export class ThreadService {
  content: Content;
  private lastTweetId = '';

  constructor(content: Content) {
    this.content = content;
  }

  async answerPrevTweet(params: any, i: any) {
    const Twit = require('twit');

    const fs = require('fs-extra');

    const T = new Twit({
      consumer_key: 'n0OlAZH30UqqglynopXkwGjcD',
      consumer_secret: 'Mg6MH596ieqKfoNZdxsNcj91z2yiqeOJwOInxAOnGaYoPtR6AW',
      access_token: '1366225590332911618-4eGbsrDjbn38aXTIOFzYoH6Ylgpjjn',
      access_token_secret: 'RbAij1PfmzI6dvA9DdBptsjM2MGNMEl0mZKv2UWEmMeWS',
      timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
      strictSSL: true, // optional - requires SSL certificates to be valid.
    });

    const imagePath = `./content/${i}-original.png`;
    const b64content = fs.readFileSync(imagePath, { encoding: 'base64' });

    const tweetPromise = new Promise((resolve, reject) => {
      T.post('media/upload', { media_data: b64content }, function (
        err: any,
        data: any,
      ) {
        const mediaIdStr = data.media_id_string;
        const altText = 'A picture';
        const meta_params = {
          media_id: mediaIdStr,
          alt_text: { text: altText },
        };

        T.post('media/metadata/create', meta_params, async function (err: any) {
          if (!err) {
            const blau = {
              ...params,
              media_ids: [mediaIdStr],
            };

            T.post('statuses/update', blau, function (
              err: any,
              data: any,
              response: any,
            ) {
              if (err) {
                reject(err);
                return;
              }

              if (data) {
                resolve(data);
              }
            });
          }
        });
      });
    });

    const createdTweet = await tweetPromise as ICreatedTweet;
    this.lastTweetId = createdTweet.id_str
    return createdTweet;
  }

  async generateThread() {
    const { sentences } = this.content;
    for await (const [i, sentence] of sentences.entries()) {
      const params = {
        status: sentence.text,
        in_reply_to_status_id: `${this.lastTweetId}`,
      };
      console.log(`[make-thread] Tweeting: ${sentence.text}`);
      await this.answerPrevTweet(params, i);
    }
  }
}
