import { dateToBool, dateToStringArray } from './calendar';
export interface IDate {
  dateAsString: string;
  date: Date;
  display: string;
  otherMonth: boolean | dateToBool;
  otherYear: boolean | dateToBool;
  disabled: boolean | dateToBool;
  classes: string[] | dateToStringArray;
}
