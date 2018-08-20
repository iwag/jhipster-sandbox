import { Moment } from 'moment';
import { IKusaGroup } from 'app/shared/model//kusa-group.model';

export interface IKusaActivity {
  id?: number;
  doneAt?: Moment;
  count?: number;
  kusaGroup?: IKusaGroup;
}

export const defaultValue: Readonly<IKusaActivity> = {};
