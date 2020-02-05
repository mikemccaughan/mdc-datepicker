import { IWeek } from './IWeek';
export class MonthCalendar {
  value: string;
  display: string;
  prev: string;
  next: string;
  weekStartDay: string;
  weeks: IWeek[];
}
