import { ComboStringValue } from './models/complexModel';

export const PageSizeOptions = [10, 20, 50, 100, 500, 1000];

export const MY_FORMATS = {
    parse: {
      dateInput: 'L',
    },
    display: {
      dateInput: 'L',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'L',
      monthYearA11yLabel: 'MMMM YYYY',
    },
  };

export const ComboStringAll: ComboStringValue = {
    VALUE: null,
    DISPLAY: 'All : All',
    CODE: null,
};
