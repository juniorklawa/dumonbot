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

      const createdSubject = await Subject.create({ name: 'Casemiro' });

      console.log(createdSubject);
      return '';
    } catch (e) {
      throw new Error(e);
    }
  }
}
