import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { updateProfile } from '@angular/fire/auth';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { CloudService } from 'src/app/services/cloud.service';
import { DbService } from 'src/app/services/db.service';
import { americanStates, validateUSZipCode } from 'src/app/utilities/form.util';

@Component({
  selector: 'edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.scss']
})
export class EditProfileModalComponent implements OnInit, OnChanges {
  @Input() user;
  @Output() onSubmit = new EventEmitter<any>();
  selectedFile: File | null = null;
  profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    address: this.fb.group({
      street: ['',Validators.required],
      city: ['',Validators.required],
      state: ['',Validators.required],
      zip: ['', validateUSZipCode]
    }),
    phone: ['']
  });
  americanStates = americanStates;
  constructor(private fb: FormBuilder, private auth: AuthService, private db: DbService, private cloud: CloudService) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.user?.currentValue) {
      let newValue = changes.user.currentValue;
      this.resetForm(newValue);
    }
  }
  ngOnInit() {
    const myModalEl = document.getElementById('editProfileModal')
    myModalEl.addEventListener('hidden.bs.modal', event => {
      this.resetForm(this.user);
    })
  }
  resetForm(user) {
    this.profileForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      address: {
        street: user.address.street,
        city: user.address.city,
        state: user.address.state,
        zip: user.address.zip
      },
      phone: user.phone
    });
  }
  get pfc() { return this.profileForm.controls; }
  get afc() {return this.profileForm.controls.address.controls}
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  async _onSubmit() {
    if(this.profileForm.valid) {
      let value: any = this.profileForm.value;
      if(this.selectedFile) {
        let photoUrl = await this.cloud.uploadPhotoPic('users',this.user.uid,this.selectedFile);
        value.photoUrl = photoUrl;
        await updateProfile(this.auth.getUser(), {displayName: value.firstName + ' ' + value.lastName, photoURL: value.photoUrl});
      } else {
        await updateProfile(this.auth.getUser(), {displayName: value.firstName + ' ' + value.lastName});
      }
      this.auth.reload();
      await this.db.updateUser(this.user.uid, value);
      this.onSubmit.next(value);
      this.resetForm(this.user);
    }
  }
}
