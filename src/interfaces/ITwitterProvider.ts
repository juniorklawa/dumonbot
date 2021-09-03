import { ITweetData } from '../services/ThreadService';

export default interface ITwitterProvider {
  post(method: string, data: unknown): Promise<ITweetData>;
}
