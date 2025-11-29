import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-add-friend-modal',
  templateUrl: 'add-friend-modal.component.html',
})
export class AddFriendModal {
  name!: string;

  constructor(private modalCtrl: ModalController) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }
}
