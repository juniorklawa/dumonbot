import Subject from '../models/Subject';
import sentenceBoundaryDetection from 'sbd';

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

  const sentences = sentenceBoundaryDetection.sentences(
    doc?.sections()[0]?.text(),
  );

  if (sentences.length <= 2) {
    console.log('subject too short:', newSubject.name);
    return;
  }

  const subjectExists = await Subject.findOne({ name: newSubject.name });

  if (subjectExists) {
    console.log('subject already exists', newSubject.name);
  }

  await Subject.create(newSubject);
  console.log('subject created', newSubject.name);
}

export default createNewSubject;
