import { DateTime } from 'luxon';
import { MonthCalendar } from './MonthCalendar';
import { IDate } from './IDate';

export type dateToBool = (d: Date) => boolean;
export type dateToStringArray = (d: Date) => string[];

/**
 * Does basic validation on year and month for the getMonth function.
 * @param year {Date|string|number|undefined}
 * @param month {number|undefined}
 */
function validateYearAndMonth(year?: Date | string | number, month?: number): { year: number, month: number } {
  console.log('year: ', year, ' month: ', month);
  console.log('typeof year: ', typeof year);
  if (year instanceof Date) {
    if (isNaN(year.valueOf())) {
      throw new Error(
        'If year is specified as a Date, it must be a valid date.'
      );
    }
    month = year.getMonth();
    year = year.getFullYear();
  } else if (typeof year === 'string') {
    const valid = /^\d{4}\-\d{2}$/.test(year);
    if (!valid) {
      throw new Error(
        `If year is specified as a string, it must be in yyyy-MM format. The value specified, "${year}", was not.`
      );
    }
    month = +year.substring(year.indexOf('-') + 1);
    year = +year.substring(0, year.indexOf('-'));
  } else if (typeof year === 'number') {
    if (typeof month !== 'number' || isNaN(month) || month < 0 || month > 11) {
      throw new Error(
        'If year is specified as a number, month must be a number between 0 and 11, inclusive.'
      );
    }
  }
  if (!year && !month) {
    var today = new Date();
    year = today.getFullYear();
    month = today.getMonth();
  }
  return { year, month };
}
/**
 * Gets a calendar month.
 * If no arguments defined, the current local year and month, according to the host.
 * If year is a Date, the local year and month.
 * If year is a string, parsed as yyyy-MM (ISO year and month format)
 * If year is a number, parsed as a full year (in other words, 99 is the year 99, not 1999 nor 2099)
 * If year is a number, month must be suppliend.
 * If supplied, month must be a number between 0 and 11, using JavaScript's standard of 0-based counting of the months.
 * @param options {object}
 */
export function getMonth(options: { year?: Date | string | number | undefined, month?: number, disableDate?: dateToBool }): MonthCalendar {
  let { disableDate } = options;
  let { year, month } = validateYearAndMonth(options.year, options.month);

  let dt = DateTime.fromObject({
    year,
    month,
    day: 1
  });

  let value = dt.toISODate().substring(0, 7);
  let display = dt.toFormat('MMMM y');
  let prev = dt
    .minus({ months: 1 })
    .toISODate()
    .substring(0, 7);
  let next = dt
    .plus({ months: 1 })
    .toISODate()
    .substring(0, 7);

  let result: MonthCalendar = {
    value,
    display,
    prev,
    next,
    weekStartDay: 'iso',
    weeks: []
  };

  // Get the first day of the first ISO week in the month
  let startOfMonthAndWeek = dt.startOf('month').startOf('week');
  // Get the last day of the last ISO week in the month
  let endOfMonthAndWeek = dt.endOf('month').endOf('week');
  // Iterate over all of the days between
  let dayCount = endOfMonthAndWeek.diff(startOfMonthAndWeek, 'days').days;

  for (let i = 0; i < dayCount; i++) {
    let date = startOfMonthAndWeek.plus({ day: i });
    let week = result.weeks.find(w => w.week === date.weekNumber);
    let found = !!week;
    if (!found) {
      week = {
        week: date.weekNumber,
        weekType: 'iso',
        dates: []
      };
    }
    let day: IDate = {
      dateAsString: date.toISODate(),
      date: date.toJSDate(),
      display: date.toFormat('EEEE MMMM d, yyyy'),
      otherMonth: date.month !== dt.month,
      otherYear: date.year !== dt.year,
      disabled:
        typeof disableDate === 'function'
          ? disableDate(date.toJSDate())
          : false,
      classes: [
        'mdc-button',
        'mdc-calendar-day',
        ...(date.month !== dt.month || date.year !== dt.year
          ? ['mdc-calendar-day-off']
          : [])
      ]
    };
    week.dates.push(day);
    if (!found) {
      result.weeks.push(week);
    }
  }

  return result;
}
