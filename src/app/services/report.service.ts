import { Injectable } from "@angular/core";
import { Schema } from "../../../amplify/data/resource";
import { generateClient } from 'aws-amplify/data';
import { ShoppingListService } from "./shopping-list.service";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: 'root',
})
export class ReportService {
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
}
