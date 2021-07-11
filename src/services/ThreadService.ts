import { Content } from '../classes/Content';

interface ICreatedTweet {
  id_str: string;
  id: number;
  text: string;
}

export class ThreadService {
  private lastTweetId = '';

  constructor(private content: Content) {}

  async answerPrevTweet(params: any, i: any): Promise<ICreatedTweet> {
    const Twit = require('twit');

    const fs = require('fs-extra');

    const T = new Twit({
      consumer_key: process.env.TWIT_CONSUMER_KEY,
      consumer_secret: process.env.TWIT_CONSUMER_SECRET,
      access_token: process.env.TWIT_ACCESS_TOKEN,
      access_token_secret: process.env.TWIT_ACCESS_TOKEN_SECRET,
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

    const createdTweet = (await tweetPromise) as ICreatedTweet;
    this.lastTweetId = createdTweet.id_str;
    return createdTweet;
  }

  async generateThread(): Promise<void> {
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
