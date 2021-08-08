import mongoose from 'mongoose';
import Subject from '../models/Subject';

export class SubjectOfTheDayService {
  async getSubjectOfTheDay(): Promise<string> {
    console.log('> [Get Subject] Starting...');
    try {
      mongoose.connect(
        `mongodb+srv://admin:sqj140uUnEp63nww@cluster0.jxelo.gcp.mongodb.net/dumonbot?retryWrites=true&w=majority`,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
      );

      const fetchedSubjectList = await Subject.aggregate([
        { $match: { hasThread: false, isAllowed: true } },
        { $sample: { size: 1 } },
      ]);

      const subjectOfTheDay = fetchedSubjectList[0].name as string;

      return subjectOfTheDay;
    } catch (e) {
      throw new Error(e);
    }
  }
}