import { Moment } from 'moment';
import { IAccountUser } from 'app/shared/model//account-user.model';
import { IKusaActivity } from 'app/shared/model//kusa-activity.model';

export interface IKusaGroup {
  id?: number;
  title?: string;
  body?: string;
  startedAt?: Moment;
  accountUser?: IAccountUser;
  activities?: IKusaActivity[];
}

export const defaultValue: Readonly<IKusaGroup> = {};
