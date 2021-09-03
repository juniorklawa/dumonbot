import { Content } from '../classes/Content';
import { ICreatedTweet } from '../models/ICreatedTweet';
import { IThreadService } from './interfaces/IThreadService';

interface ITweetData {
  media_id_string: string;
}

interface ITweetParams {
  status: string;
  in_reply_to_status_id: string;
}

export class ThreadService implements IThreadService {
  private lastTweetId = '';

  constructor(private content: Content) {}

  async answerPrevTweet(
    params: ITweetParams,
    i: number,
  ): Promise<ICreatedTweet> {
    try {
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

      if (
        i === this.content.sentences.length - 1 ||
        !fs.existsSync(imagePath)
      ) {
        const lastTweetPromisse = new Promise((resolve, reject) => {
          T.post('statuses/update', params, function (
            err: string,
            data: ITweetData,
          ) {
            if (err) {
              reject(err);
              return;
            }

            if (data) {
              resolve(data);
            }
          });
        });

        const createdTweet = (await lastTweetPromisse) as ICreatedTweet;
        this.lastTweetId = createdTweet.id_str;

        return createdTweet;
      }

      const b64content = fs.readFileSync(imagePath, { encoding: 'base64' });

      const tweetPromise = new Promise((resolve, reject) => {
        T.post('media/upload', { media_data: b64content }, function (
          _: string,
          data: ITweetData,
        ) {
          const mediaIdStr = data.media_id_string;
          const altText = 'A picture';
          const meta_params = {
            media_id: mediaIdStr,
            alt_text: { text: altText },
          };

          T.post('media/metadata/create', meta_params, async function (
            err: string,
          ) {
            if (!err) {
              const formattedObject = {
                ...params,
                media_ids: [mediaIdStr],
              };

              T.post('statuses/update', formattedObject, function (
                err: string,
                data: ITweetData,
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
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async generateThread(): Promise<void> {
    try {
      console.log('> [Thread Service] Generating thread...');

      const { sentences } = this.content;

      for await (const [i, sentence] of sentences.entries()) {
        const params = {
          status: sentence.text,
          in_reply_to_status_id: `${this.lastTweetId}`,
        };
        console.log(
          `[Thread Service] Tweeting ${i + 1}/${
            this.content.sentences.length
          }: ${sentence.text}`,
        );
        await this.answerPrevTweet(params, i);
      }
      console.log(`[Thread Service] Finished Thread`);
    } catch (err: any) {
      throw new Error(err);
    }
  }
}
