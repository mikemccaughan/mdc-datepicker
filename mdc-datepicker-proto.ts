import { MDCTextFieldIcon, MDCTextField } from './node_modules/@material/textfield/index';
import { MDCFloatingLabel } from './node_modules/@material/floating-label/component';
import { MDCSelect } from './node_modules/@material/select/index';
import { getMonth } from './calendar';
import { MonthCalendar } from "./MonthCalendar";
import { IWeek } from './IWeek';
import { IDate } from './IDate';

export class MdcDatePickerPrototype {
    value: Date;
    format: string;
    state:
        | 'inactive'
        | 'active'
        | 'inactive-populated'
        | 'active-populated'
        | 'disabled'
        | 'disabled-populated' = 'inactive';
    direction: 'down' | 'up' | 'end' | 'start' = 'down';
    pattern: string;
    patternParts: { value: string, type: string }[];
    textField: MDCTextField;
    toggleElement: HTMLElement;
    toggleTextFieldIcon: MDCTextFieldIcon;
    textFieldLabel: MDCFloatingLabel;
    monthSelect: MDCSelect;
    wrapperElement: HTMLElement;
    dropdownElement: HTMLElement;
    calendarElement: HTMLElement;
    onToggle: (e: Event) => void;
    constructor(private element: HTMLInputElement) {
        this.textField = new MDCTextField(this.element.closest('.mdc-text-field'));
        this.wrapperElement = this.element.closest('.mdc-date-picker');
        this.textFieldLabel = new MDCFloatingLabel(this.wrapperElement.querySelector('.mdc-calendar-input-label'))
        this.dropdownElement = this.wrapperElement.querySelector(
            '.mdc-calendar-dropdown'
        );
        this.toggleElement = this.element.parentElement.querySelector(
            '.mdc-text-field__icon'
        );
        this.calendarElement = this.wrapperElement.querySelector('.mdc-calendar');
        this.toggleTextFieldIcon = new MDCTextFieldIcon(this.toggleElement);
        this.toggleTextFieldIcon.foundation.handleInteraction = (event: Event) => {
            if (event.type === 'click') {
                this.toggle(event);
            }
        };
        this.monthSelect = new MDCSelect(this.wrapperElement.querySelector('.mdc-calendar-month'));
        this.monthSelect.listen('MDCSelect:change', () => {
            const calendar: MonthCalendar = getMonth({ year: this.monthSelect.value });
            this.updateCalendar(calendar);
        }, false);

        const testDate1 = new Date(2020, 4, 5);
        const testDate2 = new Date(2020, 10, 15);
        const testParts1 = new Intl.DateTimeFormat(undefined, {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        }).formatToParts(testDate1);
        const testParts2 = new Intl.DateTimeFormat(undefined, {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        }).formatToParts(testDate2);
        let pattern = '^';
        let patternParts = [
            { value: '00', type: 'month' },
            { value: '/', type: 'literal' },
            { value: '00', type: 'day' },
            { value: '/', type: 'literal' },
            { value: '0000', type: 'year' },
        ];
        if (testParts1.length === 5 && testParts2.length === 5) {
            pattern = `${pattern}(\\d{${testParts1[0].value.length},${testParts2[0].value.length}})\\${testParts1[1].value}(\\d{${testParts1[2].value.length},${testParts2[2].value.length}})\\${testParts1[3].value}(\\d{${testParts1[4].value.length},${testParts2[4].value.length}})\$`;
            patternParts = [...testParts2];
        } else {
            pattern += '(\\d{1,2})\\/(\\d{1,2})\\/(\\d{2}|\\d{4})$';
        }
        this.pattern = pattern;
        this.patternParts = patternParts;
        this.validate();
    }
    validate() {
        if (this.textField.value !== null && this.textField.value.length) {
            const re = new RegExp(this.pattern);
            this.textField.valid = re.test(this.textField.value);
            if (this.textField.valid) {
                const matches = re.exec(this.textField.value);
                const parts = {
                    [this.patternParts[0].type]: matches[1],
                    [this.patternParts[2].type]: matches[2],
                    [this.patternParts[4].type]: matches[3]
                };
                this.value = new Date(+parts.year, +parts.month - 1, +parts.day);
            }
        }
    }
    closeCal = this.closeCalendar.bind(this);
    closeCalendar(e: Event) {
        if (
            this.toggleElement.contains(e.target as Node) ||
            this.dropdownElement.contains(e.target as Node) ||
            document.querySelector('.mdc-select__menu').contains(e.target as Node)
        ) {
            return;
        }

        console.log('not in toggle or dropdown:', e.target);
        this.dropdownElement.classList.remove('show');
    }
    toggle(e: Event) {
        if (this.onToggle) {
            this.onToggle(e);
        }
        if (!e.defaultPrevented) {
            this.dropdownElement.classList.toggle('show');
            if (this.dropdownElement.classList.contains('show')) {
                document.documentElement.addEventListener(
                    'click',
                    this.closeCal,
                    false
                );
            } else {
                document.documentElement.removeEventListener('click', this.closeCal);
            }
        }
    }
    getToday() {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }
    updateCalendar(calendar: MonthCalendar) {
        console.log('binding to ', calendar);
        this.calendarElement.querySelectorAll('.mdc-calendar-day').forEach(button => button.remove());
        const getClasses = (dt: IDate) => typeof dt.classes === 'function' ? dt.classes(dt.date) : dt.classes;
        const getClassNames = (dt: IDate) => [
            ...getClasses(dt),
            (dt.date.valueOf() === this.value.valueOf() ? 'mdc-calendar-day-selected' : ''),
            (dt.date.valueOf() === this.getToday().valueOf() ? 'mdc-calendar-today' : '')
        ].join(' ');
        const html = calendar.weeks.flatMap((wk: IWeek) =>
            wk.dates.map((dt: IDate) =>
                `<button type="button" class="${getClassNames(dt)}" data-value="${dt.dateAsString}" title="${dt.display}">${dt.date.getDate()}</button>`)).join('');
        console.log(this.value);
        this.calendarElement.insertAdjacentHTML('beforeend', html);
    }
}
