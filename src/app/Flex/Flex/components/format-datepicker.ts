import { NativeDateAdapter } from '@angular/material';
import { MatDateFormats } from '@angular/material/core';
export class AppDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      let day: string = date.getDate().toString();
      day = +day < 10 ? '0' + day : day;
      let month: string = (date.getMonth() + 1).toString();
      month = +month < 10 ? '0' + month : month;
      month = this.MonthMMM(month);
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return date.toDateString();
  }

  MonthMMM(month: string) {
    let returnMonth: string;
    switch (month) {
        case '01': returnMonth = 'Jan'; break;
        case '02': returnMonth = 'Feb'; break;
        case '03': returnMonth = 'Mar'; break;
        case '04': returnMonth = 'Apr'; break;
        case '05': returnMonth = 'May'; break;
        case '06': returnMonth = 'Jun'; break;
        case '07': returnMonth = 'Jul'; break;
        case '08': returnMonth = 'Aug'; break;
        case '09': returnMonth = 'Sep'; break;
        case '10': returnMonth = 'Oct'; break;
        case '11': returnMonth = 'Nov'; break;
        case '12': returnMonth = 'Dec'; break;
    }
    return returnMonth;
  }

}
export const APP_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'numeric' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric'
    },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  }
};
