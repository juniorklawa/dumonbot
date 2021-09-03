import { Content } from '../classes/Content';
import { IThreadService } from '../interfaces/IThreadService';
import { ICreatedTweet } from '../models/ICreatedTweet';
import TwitterProvider from '../providers/TwitterProvider';

export interface ITweetData {
  media_id_string: string;
  id_str: string;
}

interface ITweetParams {
  status: string;
  in_reply_to_status_id: string;
}

export default class ThreadService implements IThreadService {
  private lastTweetId = '';

  constructor(
    private content: Content,
    private twitterProvider: TwitterProvider,
  ) {}

  async answerPrevTweet(
    params: ITweetParams,
    i: number,
  ): Promise<ICreatedTweet> {
    const fs = require('fs-extra');

    const imagePath = `./content/${i}-original.png`;

    if (i === this.content.sentences.length - 1 || !fs.existsSync(imagePath)) {
      const lastTweetPromisse = await this.twitterProvider.post(
        'statuses/update',
        params,
      );

      const createdTweet = lastTweetPromisse as any;
      this.lastTweetId = createdTweet.id_str;

      return createdTweet;
    }

    const b64content = fs.readFileSync(imagePath, { encoding: 'base64' });

    const { media_id_string } = await this.twitterProvider.post(
      'media/upload',
      {
        media_data: b64content,
      },
    );

    const mediaIdStr = media_id_string;
    const altText = 'A picture';
    const meta_params = {
      media_id: mediaIdStr,
      alt_text: { text: altText },
    };

    await this.twitterProvider.post('media/metadata/create', meta_params);

    const formattedObject = {
      ...params,
      media_ids: [mediaIdStr],
    };

    const createdTweet = await this.twitterProvider.post(
      'statuses/update',
      formattedObject,
    );
    this.lastTweetId = createdTweet.id_str;
    return createdTweet as any;
  }

  async generateThread(): Promise<void> {
    console.log('> [Thread Service] Generating thread...');

    const { sentences } = this.content;

    for await (const [i, sentence] of sentences.entries()) {
      const params = {
        status: sentence.text,
        in_reply_to_status_id: `${this.lastTweetId}`,
      };
      console.log(
        `[Thread Service] Tweeting ${i + 1}/${this.content.sentences.length}: ${
          sentence.text
        }`,
      );
      await this.answerPrevTweet(params, i);
    }
    console.log(`[Thread Service] Finished Thread`);
  }
}
