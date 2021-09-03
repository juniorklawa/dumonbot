import Subject from '../../models/Subject';
import SubjectOfTheDayService from '../../services/SubjectOfTheDayService';

describe('SubjectOfTheDayService', () => {
  test('should get the subject of the day', async () => {
    const subjectOfTheDayService = new SubjectOfTheDayService();

    jest
      .spyOn(Subject, 'aggregate')
      .mockImplementationOnce(() =>
        Promise.resolve([{ name: 'Santos Dumont' }]),
      );

    const subject = await subjectOfTheDayService.getSubjectOfTheDay();

    expect(subject).toBe('Santos Dumont');
  });
});
