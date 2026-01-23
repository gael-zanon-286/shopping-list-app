import { Injectable } from "@angular/core";
import { Schema } from "../../../amplify/data/resource";
import { generateClient } from 'aws-amplify/data';
import { ShoppingListService } from "./shopping-list.service";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  editMode: boolean = false;
  private client;

  constructor(private translate: TranslateService) {
    this.client = generateClient<Schema>();
  }

  // Create a new report based on shopping lists within the date range
  async createReport(name: string, startDate: Date, endDate: Date) {
    const lists = await this.client.models.ShoppingList.list({
      filter: {
        createdAt: {
          between: [startDate.toISOString(), endDate.toISOString()],
        },
        type: {
          eq: 'HISTORIC',
        }
      },
    });

    const defaultCategory = {
      name: this.translate.instant('uncategorized'),
      items: [] as Array<Record<string, any>>,
      totalCost: 0,
    };

    for (const list of lists.data) {
      const listItems = await list.items();
      const items = listItems?.data ?? [];

      const mapped = items.map((item: any) => ({
        name: item?.name ?? null,
        cost: item?.cost ?? null,
        date: list.date ?? null,
      }));

      defaultCategory.items.push(...mapped);
    }

    defaultCategory.totalCost = defaultCategory.items.reduce((sum, item: any) => {
      const c = (typeof item.cost === 'number') ? item.cost : Number(item.cost) || 0;
      return sum + c;
    }, 0);

    try {
      const { data } = await this.client.models.Report.create({
        name: name,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        categories: JSON.stringify([defaultCategory]),
        totalCost: defaultCategory.totalCost,
      }, {
        authMode: 'userPool',
      });

      return data ?? undefined;
    } catch (error) {
      console.error('error creating report', error);
      return undefined;
    }
  }

  // Obtain all reports
  async fetchReports(): Promise<Schema['Report']['type'][]> {
    try {
      const {data: lists } = await this.client.models.Report.list({});
      return lists;
    } catch (error) {
      console.error('error fetching lists', error);
      return [];
    }
  }

  // Delete report
  async deleteReport(list: Schema['Report']['type']) {
    const reportToBeDeleted = {
      id: list.id
    }
    try {
      const deletedReport = await this.client.models.Report.delete(reportToBeDeleted);
      return deletedReport ?? undefined;
    } catch (error) {
      console.error('error creating item', error);
      return undefined;
    }
  }

  // Get report by id
  async fetchReportById(id: string): Promise<Schema['Report']['type'] | null> {
    try {
      const response = await this.client.models.Report.get({ id: id });
      return response.data ?? null;
    } catch (error) {
      console.error('error fetching report', error);
      return null;
    }
  }

  // Add or remove categories from report
  async updateCategories(reportId: string, categories: any[]): Promise<Schema['Report']['type'] | null> {
    try {
      // Calculate total cost from all categories
      const totalCost = categories.reduce((sum: number, cat: any) => {
        const catCost = typeof cat.totalCost === 'number' ? cat.totalCost : Number(cat.totalCost) || 0;
        return sum + catCost;
      }, 0);

      // a.json() field requires JSON string
      const categoriesJson = JSON.stringify(categories);

      const updatedReport = await this.client.models.Report.update({
        id: reportId,
        categories: categoriesJson,
        totalCost: totalCost,
      });

      if (updatedReport.errors && updatedReport.errors.length > 0) {
        console.error('Update errors:', updatedReport.errors);
      }

      return updatedReport.data ?? null;
    } catch (error) {
      console.error('error updating categories', error);
      console.error('error details:', JSON.stringify(error, null, 2));
      return null;
    }
  }

}

