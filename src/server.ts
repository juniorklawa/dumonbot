import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import logger from 'morgan';
import makeThread from './services/makeThread';
import getContent from './services/getContent';
import getImages from './services/getImages';

const app = express();

app.use(cors());
app.use(logger('dev'));

app.get('/', async (req, res) => {
  const content = {
    sourceContentOriginal: '',
    sourceContentSanitized: '',
    sentences: [],
    searchTerm: 'Astrologia',
  };
  await getContent(content);
  await getImages(content);
  await makeThread(content);
  res.json(content);
});

app.listen(3333, async () => {
  console.log('Server started on port 3333');
});
