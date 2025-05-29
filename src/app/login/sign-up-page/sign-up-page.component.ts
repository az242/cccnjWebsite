import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { updateProfile } from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from 'src/app/common/footer/footer.component';
import { User, getAgeTag } from 'src/app/common/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CloudService } from 'src/app/services/cloud.service';
import { DbService } from 'src/app/services/db.service';
import { americanStates, passwordComplexityValidator, passwordValidator, validateUSZipCode } from 'src/app/utilities/form.util';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.scss'],
  imports: [FooterComponent, NgClass, NgbDatepickerModule, ReactiveFormsModule]
})
export class SignUpPageComponent {
  alertMessage: string;
  uhg: boolean = true;
  profileForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    address: this.fb.group({
      street: [''],
      city: [''],
      state: [''],
      zip: ['', validateUSZipCode]
    }),
    familyId: [''],
    password: ['', [Validators.required, passwordComplexityValidator]],
    passwordCheck: ['', Validators.required],
    dob: [undefined, Validators.required],
    photoUrl: [''],
    phone: ['', Validators.required],
    roles: [[] as string[]],
    groups: [[] as string[]],
    events: [[] as string[]],
    member: ['']
  }, {validators: passwordValidator});
  americanStates = americanStates;
  selectedFile: File | null = null;
  constructor(private router: Router,private fb: FormBuilder, private auth: AuthService, private db: DbService, private cloud: CloudService) {
  }
  ngOnInit() {
    
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  get pfc() { return this.profileForm.controls; }
  get afc() {return this.profileForm.controls.address.controls}
  async onSubmit(event) {
    event.preventDefault();
    if(this.profileForm.valid) {
      let { password, passwordCheck, ...user } = this.profileForm.value;
      let results = await this.auth.register(user.email, password);
      console.log('registration results', results);
      console.log(user);
      if(results) {
        await this.auth.reload();
        await updateProfile(this.auth.getUser(), {displayName: user.firstName + ' ' + user.lastName, photoURL: user.photoUrl ? user.photoUrl : '' });
        await this.auth.reload();
        user.roles = [];
        user.roles.push(getAgeTag(user.dob));
        if(this.selectedFile) {
          let photoUrl = await this.cloud.uploadPhotoPic('users',this.auth.getUID(),this.selectedFile);
          user.photoUrl = photoUrl;
        }
        let userResult = await this.db.createUser(this.auth.getUID(), user);
        console.log('saved user profile: ', userResult);
        this.alertMessage = undefined;
        this.route('/profile');
      } else {
        this.alertMessage = 'Something went wrong with registration, Try again later!';
      }
      
    } else {
      this.alertMessage = 'Errors exist with form below, fix and re-submit!';
    }
    
  }
  route(path) {
    this.router.navigate([path],{queryParamsHandling: 'merge'});
  }
}

