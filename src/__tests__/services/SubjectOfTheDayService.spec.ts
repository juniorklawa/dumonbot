import SubjectOfTheDayService from '../../services/SubjectOfTheDayService';

describe('SubjectOfTheDayService', () => {
  test('working', async () => {
    const subjectOfTheDayService = new SubjectOfTheDayService();

    const subject = await subjectOfTheDayService.getSubjectOfTheDay();

    expect(subject).toBeTruthy();
  });
});
