import { ISubject } from '../interfaces/ISubject';
import Subject from '../models/Subject';

export default class SubjectOfTheDayService {
  async getSubjectOfTheDay(): Promise<ISubject> {
    console.log('> [Subject of the day service] Getting subject of the day...');
    const fetchedSubjectList = await Subject.aggregate([
      { $match: { hasThread: false, isAllowed: true } },
      { $sample: { size: 1 } },
    ]);

    const subjectOfTheDay = fetchedSubjectList[0] as ISubject;

    return subjectOfTheDay;
  }
}
