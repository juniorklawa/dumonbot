import ITwitterProvider from '../../interfaces/ITwitterProvider';
import { ITweetData } from '../../services/ThreadService';

export default class FakeTwitterProvider implements ITwitterProvider {
  async post(_method: string, _data: unknown): Promise<ITweetData> {
    return new Promise(resolve => {
      resolve({
        id_str: 'abc',
        media_id_string: '123123',
      });
    });
  }
}
