import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { menuOutline, chevronDownOutline } from "ionicons/icons";
import { ReportService } from '../../services/report.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html'
})
export class ReportComponent  implements OnInit {
  loading: boolean = true;
  reportId: string = '';
  report: any = null;
  categories: any[] = [];
  items: any[] = [];
  menuOutline = menuOutline;
  chevronDown = chevronDownOutline;

  constructor(private route: ActivatedRoute, private reportService: ReportService, private utilsService: UtilsService) { }

  async ngOnInit() {
    this.reportId = this.route.snapshot.paramMap.get('id')!;

    this.report = await this.reportService.fetchReportById(this.reportId);

    const { categories, items } = this.utilsService.parseCategories(this.report) || {};
    this.categories = categories || [];
    this.items = items || [];
    console.log(this.items);

    this.loading = false;
  }

}
