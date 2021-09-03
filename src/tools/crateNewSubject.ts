import Subject from '../models/Subject';

async function createNewSubject() {
  const newSubject = {
    name: 'Ornitorrinco',
  };

  const wikipediaService = require('wtf_wikipedia');
  const doc = await wikipediaService.fetch(newSubject.name, 'pt');
  if (!doc?.sections()[0]?.text()) {
    console.log('nao achei', newSubject.name);
    return;
  }
  await Subject.create(newSubject);

  console.log('assunto criado', newSubject);
}

createNewSubject();
