import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { menuOutline, chevronDownOutline, addCircleOutline, trashBin } from "ionicons/icons";
import { ReportService } from '../../services/report.service';
import { UtilsService } from '../../services/utils.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html'
})
export class ReportComponent  implements OnInit {
  loading: boolean = true;
  reportId: string = '';
  report: any = null;
  categories: any[] = [];
  newCategoryName: string | null = null;
  menuOutline = menuOutline;
  trashBin = trashBin;
  chevronDown = chevronDownOutline;
  addCircleOutline = addCircleOutline;

  constructor(private route: ActivatedRoute, public reportService: ReportService, private utilsService: UtilsService, private translate: TranslateService, private cdr: ChangeDetectorRef) { }

  async ngOnInit() {
    this.reportService.editMode = false;
    this.reportId = this.route.snapshot.paramMap.get('id')!;

    this.report = await this.reportService.fetchReportById(this.reportId);

    const { categories, items } = this.utilsService.parseCategories(this.report) || {};
    this.categories = categories || [];

    this.loading = false;
  }

  async addCategory() {
    const newCategory = {
      name: this.newCategoryName,
      items: [] as Array<Record<string, any>>,
      totalCost: 0,
    };
    this.categories.push(newCategory);
    await this.reportService.updateCategories(this.reportId, this.categories);
    this.report = await this.reportService.fetchReportById(this.reportId);
    this.newCategoryName = null;
  }

  async deleteCategory(category: any) {
    const index = this.categories.indexOf(category);
    this.categories.splice(index, 1);
    await this.reportService.updateCategories(this.reportId, this.categories);
    this.report = await this.reportService.fetchReportById(this.reportId);

    this.newCategoryName = null;
  }

  handleItemReorder(event: any) {
  // Build flat list with headers
  const list: Array<{
    type: 'header' | 'item';
    item?: any;
    categoryIndex?: number;
    itemIndex?: number;
  }> = [];

  this.categories.forEach((category, catIndex) => {
    list.push({ type: 'header', categoryIndex: catIndex });
    category.items.forEach((item: any, itemIndex: any) => {
      list.push({
        type: 'item',
        item,
        categoryIndex: catIndex,
        itemIndex,
      });
    });
  });

  const from = event.detail.from;
  const to = event.detail.to;

  if (from >= list.length || to >= list.length) {
    event.detail.complete(true);
    return;
  }

  const movedData = list[from];

  if (movedData.type !== 'item') {
    event.detail.complete(true);
    return;
  }

  // Let the Dom update first
  event.detail.complete(true);

  setTimeout(() => {
  const sourceCatIndex = movedData.categoryIndex!;
  const sourceItemIndex = movedData.itemIndex!;
  let targetCatIndex: number;
  let insertIndex: number;

  // Remove from list before re-inserting on target position
  const sourceCategory = this.categories[sourceCatIndex];
  const [item] = sourceCategory.items.splice(sourceItemIndex, 1);
  list.splice(from, 1);

  const targetData = list[to - 1];

  if (targetData.type === 'item') {
    // Insert at target item index if dropped on item
    targetCatIndex = targetData.categoryIndex!;
    insertIndex = targetData.itemIndex! + 1;
  } else {
    // Insert at top of that category if dropped on header
    targetCatIndex = targetData.categoryIndex!;
    insertIndex = 0;
  }

  const targetCategory = this.categories[targetCatIndex];

  // Insert at target position
  targetCategory.items.splice(insertIndex, 0, item);

  // Recalculate total cost
  this.categories = this.categories.map(cat => ({
    ...cat,
    items: [...cat.items],
    totalCost: cat.items.reduce((sum: number, i: { cost: string | number; }) => sum + (+i.cost || 0), 0),
  }));

  this.reportService.updateCategories(this.reportId, this.categories);
}, 0);

}





  trackByItem(index: number, item: any): any {
    // Track items by a unique identifier if available
    return item.id || item.name || index;
  }

  trackByCategory(index: number, category: any): any {
    // Track categories by a unique identifier if available
    return category.id || category.name || index;
  }
}
