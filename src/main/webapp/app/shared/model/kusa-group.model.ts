import { IKusaActivity } from 'app/shared/model//kusa-activity.model';
import { IUser } from './user.model';

export interface IKusaGroup {
  id?: number;
  title?: string;
  body?: string;
  actvities?: IKusaActivity[];
  user?: IUser;
}

export const defaultValue: Readonly<IKusaGroup> = {};
