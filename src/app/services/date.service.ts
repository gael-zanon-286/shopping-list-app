import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class DateService {

  parseDate(isoDate: string) {
    const date = new Date(isoDate);
    const formatedDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    return formatedDate;
  }

  parseDateTime(isoDate: string) {
    const date = new Date(isoDate);
    const formatedDate = date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0') + ' - ' + date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    return formatedDate;
  }

  parseTime(isoDate: string) {
    const date = new Date(isoDate);
    const formatedDate = date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
    return formatedDate;
  }
}
