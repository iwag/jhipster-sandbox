import { Moment } from 'moment';

export interface IPlayer {
  id?: number;
  name?: string;
  created_at?: Moment;
}

export const defaultValue: Readonly<IPlayer> = {};
