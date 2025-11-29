import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HeaderService {
  private messageSource = new BehaviorSubject<string>('My Lists');
  private toggleSource = new BehaviorSubject<boolean>(false);
  message$ = this.messageSource.asObservable();
  costToggle$ = this.toggleSource.asObservable();

  sendMessage(msg: string) {
    this.messageSource.next(msg);
  }

  sendToggle(toggle: boolean) {
    this.toggleSource.next(toggle);
  }
}
