import { Component, OnInit } from '@angular/core';
import { trashBin, addCircleOutline } from "ionicons/icons";
import { DateService } from '../services/date.service';
import { Schema } from '../../../amplify/data/resource';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CreateReportComponent } from './create-report/create-report.component';
import { ReportService } from '../services/report.service';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
})
export class ReportListComponent  implements OnInit {
  loading: boolean = true;
  trashBin = trashBin;
  addCircleOutline = addCircleOutline;
  reportList: any = null;

  constructor(
    public dateService: DateService,
    private reportService: ReportService,
    private translate: TranslateService,
    private modalCtrl: ModalController,
    private router: Router,
    private alertController: AlertController,
  ) { }

  async ngOnInit() {
    this.reportList = await this.reportService.fetchReports();
    this.loading = false;
  }

  // Add Report
  async addReport(data: any) {
    if (data.name) {
      await this.reportService.createReport(data.name, data.startDate, data.endDate);
      this.reportList = await this.reportService.fetchReports();
    } else {
      console.log('No name introduced');
    }
  }

  // Delete report
  async deleteReport(list: Schema['Report']['type']) {
    await this.reportService.deleteReport(list);
    this.reportList = await this.reportService.fetchReports();
  }

  // Navigate to selected report
  go(url: string) {
    this.router.navigateByUrl('report-list/' + url);
  }

  // Deletion confirmation dialog
  async confirmationAlert(list: Schema['Report']['type']) {
    const alert = await this.alertController.create({
      header: this.translate.instant('confirmation'),
      subHeader: list.name,
      message: this.translate.instant('reports.deleteConfirmation'),
      buttons: [
        {
          text: this.translate.instant('no'),
          role: 'cancel',
        },
        {
          text: this.translate.instant('yes'),
          role: 'confirm',
          handler: () => {
            this.deleteReport(list);
          }
        }
      ]
    });
    await alert.present();
  }

  // Modal to create new report
  async openModal() {
    const modal = await this.modalCtrl.create({
      component: CreateReportComponent,
      cssClass: 'create-report-modal'
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.addReport(data);
    }
  }

}
