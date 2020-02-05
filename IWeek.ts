import { IDate } from './IDate';
export interface IWeek {
  week: number;
  weekType: string;
  dates: IDate[];
}
