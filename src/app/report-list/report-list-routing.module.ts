import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportListComponent } from './report-list.component';
import { ReportComponent } from './report/report.component';


const routes: Routes = [
  {
    path: '',
    component: ReportListComponent,
  },
  {
    path: ':id',
    component: ReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ReportListRoutingModule { }
