import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { OperatorFunction, Observable, debounceTime, distinctUntilChanged, map } from 'rxjs';
@Component({
  selector: 'add-family-member-modal',
  templateUrl: './add-family-member-modal.component.html',
  styleUrls: ['./add-family-member-modal.component.scss']
})
export class AddFamilyMemberModalComponent {
  @Output() onSubmit = new EventEmitter<any>();
  @Input() userList;
  @Input() familyMembers;
  @Input() uid;
  member;

  ngOnInit() {
    const myModalEl = document.getElementById('exampleModal')
    myModalEl.addEventListener('hidden.bs.modal', event => {
      this.member = undefined;
    })
  }
  formatter = (result) => result.firstName + ' ' + result.lastName + ' ' + result.email;
  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map((term) =>
      term.length < 2 ? [] : this.userList.filter((user) => 
      ((user.firstName+' '+user.lastName).toLowerCase().indexOf(term.toLowerCase()) > -1 || user.email.toLowerCase().indexOf(term.toLowerCase()) > -1) && 
       this.familyMembers.findIndex(ele => ele.uid === user.uid) === -1 && user.uid !== this.uid).slice(0, 10),
    ),
  );
  addFamilyMember() {
    if(this.member.familyId) {
      // member has family, ask to merge or give advice to tell other member to clear his family
      var myModal = new bootstrap.Modal(document.getElementById('familyExistsModal'), {});
      myModal.show();
      this.member = undefined;
      return;
    }
    this.onSubmit.next(this.member);
    this.member = undefined;
  }
}
