import { ICreatedTweet } from '../models/ICreatedTweet';

export interface IThreadService {
  answerPrevTweet(params: any, i: any): Promise<ICreatedTweet>;
  generateThread(): Promise<void>;
}
