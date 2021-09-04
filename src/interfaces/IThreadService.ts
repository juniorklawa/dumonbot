import { ITweetData } from '../services/ThreadService';
import { ITweetParams } from './ITweetParams';

export interface IThreadService {
  answerPrevTweet(params: ITweetParams, i: number): Promise<ITweetData>;
  generateThread(): Promise<void>;
}
