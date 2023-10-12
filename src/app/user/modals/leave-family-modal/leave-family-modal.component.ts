import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'leave-family-modal',
  templateUrl: './leave-family-modal.component.html',
  styleUrls: ['./leave-family-modal.component.scss']
})
export class LeaveFamilyModalComponent {
  @Output() onSubmit = new EventEmitter<any>();
  leaveFamily() {
    this.onSubmit.next(true);
  }
}
