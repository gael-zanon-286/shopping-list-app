import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ReportListComponent } from './report-list.component';
import { ReportListRoutingModule } from './report-list-routing.module';
import { CreateReportComponent } from './create-report/create-report.component';
import { ReportComponent } from './report/report.component';



@NgModule({
  declarations: [ReportListComponent, CreateReportComponent, ReportComponent],
  exports: [ReportListComponent, CreateReportComponent, ReportComponent],
  imports: [
    CommonModule, IonicModule, FormsModule, TranslateModule, ReportListRoutingModule
  ]
})
export class ReportListModule { }
