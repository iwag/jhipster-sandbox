import { Moment } from 'moment';
import { IKusaGroup } from 'app/shared/model//kusa-group.model';

export interface IKusaActivity {
  id?: number;
  doneAt?: Moment;
  kusaGroup?: IKusaGroup;
}

export const defaultValue: Readonly<IKusaActivity> = {};
