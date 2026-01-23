import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class UtilsService {

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

  dateToString(date: Date): string {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  dateToIso(date: Date): string {
    return date ? date.toISOString().split('T')[0] : '';
  }

  parseCategories(report: any) {
    let categories: any[] = [];
    if (!report) {
      return;
    }
    try {
      // Handle both array and string formats
      if (Array.isArray(report.categories)) {
        categories = report.categories;
      } else if (typeof report.categories === 'string') {
        categories = JSON.parse(report.categories || '[]');
      } else {
        categories = [];
      }
    } catch (e) {
      categories = [];
    }

    const unc = categories.find((c: any) => c.name === 'Uncategorized');
    const items = unc?.items ?? [];

    return { categories, items };
  }
}
