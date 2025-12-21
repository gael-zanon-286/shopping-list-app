import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.component.html'
})
export class CreateReportComponent {
  name: string | undefined;
  startDate: Date = new Date(new Date().setDate(new Date().getDate() - 7));
  endDate: Date = new Date;

  constructor(private modalCtrl: ModalController, public dateService: DateService) {}

  onEndDateChange(value: string | null | undefined) {
    if (value) {
      this.endDate = new Date(value);
    }
  }

  onStartDateChange(value: string | null | undefined) {
    if (value) {
      this.startDate = new Date(value);
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss({name: this.name, startDate: this.startDate, endDate: this.endDate}, 'confirm');
  }

}
