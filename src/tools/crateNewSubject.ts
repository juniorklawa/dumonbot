import Subject from '../models/Subject';

async function createNewSubject(subjectName: string): Promise<void> {
  const newSubject = {
    name: subjectName,
  };

  const wikipediaService = require('wtf_wikipedia');
  const doc = await wikipediaService.fetch(newSubject.name, 'pt');
  if (!doc?.sections()[0]?.text()) {
    console.log('subject not found', newSubject.name);
    return;
  }
  await Subject.create(newSubject);
}

export default createNewSubject;
