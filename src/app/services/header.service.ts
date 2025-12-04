import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HeaderService {
  private messageSource = new BehaviorSubject<string>('My Lists');
  private toggleSource = new BehaviorSubject<boolean>(false);
  private deleteStrikedSource = new Subject<void>();
  private addFriendSource = new Subject<void>();
  message$ = this.messageSource.asObservable();
  costToggle$ = this.toggleSource.asObservable();
  deleteStriked$ = this.deleteStrikedSource.asObservable();
  addFriend$ = this.addFriendSource.asObservable();

  sendMessage(msg: string) {
    this.messageSource.next(msg);
  }

  sendToggle(toggle: boolean) {
    this.toggleSource.next(toggle);
  }

  deleteStriked() {
    this.deleteStrikedSource.next();
  }

  addFriend() {
    this.addFriendSource.next();
  }
}
