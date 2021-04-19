import { IContent } from './getContent';

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

const makeThread = async (content: IContent): Promise<void> => {
  const lastTweetId = '';

  async function answerPrevTweet(params, i) {
    const imagePath = `./content/${i}-original.png`;
    const b64content = fs.readFileSync(imagePath, { encoding: 'base64' });

    return new Promise((resolve, reject) => {
      T.post('media/upload', { media_data: b64content }, function (err, data) {
        const mediaIdStr = data.media_id_string;
        const altText = 'A picture';
        const meta_params = {
          media_id: mediaIdStr,
          alt_text: { text: altText },
        };

        T.post('media/metadata/create', meta_params, async function (err) {
          if (!err) {
            const blau = {
              ...params,
              media_ids: [mediaIdStr],
            };

            T.post('statuses/update', blau, function (err, data, response) {
              if (err) {
                reject(err);
                return;
              }

              if (data) {
                lastTweetId = data.id_str;
                resolve(data);
              }
            });
          }
        });
      });
    });
  }

  const { sentences } = content;

  // eslint-disable-next-line no-restricted-syntax
  for await (const [i, sentence] of sentences.entries()) {
    const params = {
      status: sentence.text,
      in_reply_to_status_id: `${lastTweetId}`,
    };

    console.log(`[make-thread] Tweeting: ${sentence.text}`);

    await answerPrevTweet(params, i);
  }
};

export default makeThread;
