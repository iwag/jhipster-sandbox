import { Moment } from 'moment';
import { IKusaGroup } from 'app/shared/model//kusa-group.model';

export interface IAccountUser {
  id?: number;
  name?: string;
  createdAt?: Moment;
  groups?: IKusaGroup[];
}

export const defaultValue: Readonly<IAccountUser> = {};
