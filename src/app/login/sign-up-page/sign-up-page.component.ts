import { Component } from '@angular/core';
import { updateProfile } from '@angular/fire/auth';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.scss']
})
export class SignUpPageComponent {
  alertMessage: string;
  profileForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    firstName: [''],
    lastName: [''],
    address: this.fb.group({
      street: [''],
      city: [''],
      state: [''],
      zip: ['']
    }),
    password: ['', Validators.required],
    passwordCheck: [''],
    dob: [''],
    phone: ['']
  }, {validators: passwordValidator});
  americanStates = [
    { abbreviation: 'AL', name: 'Alabama' },
    { abbreviation: 'AK', name: 'Alaska' },
    { abbreviation: 'AZ', name: 'Arizona' },
    { abbreviation: 'AR', name: 'Arkansas' },
    { abbreviation: 'CA', name: 'California' },
    { abbreviation: 'CO', name: 'Colorado' },
    { abbreviation: 'CT', name: 'Connecticut' },
    { abbreviation: 'DE', name: 'Delaware' },
    { abbreviation: 'FL', name: 'Florida' },
    { abbreviation: 'GA', name: 'Georgia' },
    { abbreviation: 'HI', name: 'Hawaii' },
    { abbreviation: 'ID', name: 'Idaho' },
    { abbreviation: 'IL', name: 'Illinois' },
    { abbreviation: 'IN', name: 'Indiana' },
    { abbreviation: 'IA', name: 'Iowa' },
    { abbreviation: 'KS', name: 'Kansas' },
    { abbreviation: 'KY', name: 'Kentucky' },
    { abbreviation: 'LA', name: 'Louisiana' },
    { abbreviation: 'ME', name: 'Maine' },
    { abbreviation: 'MD', name: 'Maryland' },
    { abbreviation: 'MA', name: 'Massachusetts' },
    { abbreviation: 'MI', name: 'Michigan' },
    { abbreviation: 'MN', name: 'Minnesota' },
    { abbreviation: 'MS', name: 'Mississippi' },
    { abbreviation: 'MO', name: 'Missouri' },
    { abbreviation: 'MT', name: 'Montana' },
    { abbreviation: 'NE', name: 'Nebraska' },
    { abbreviation: 'NV', name: 'Nevada' },
    { abbreviation: 'NH', name: 'New Hampshire' },
    { abbreviation: 'NJ', name: 'New Jersey' },
    { abbreviation: 'NM', name: 'New Mexico' },
    { abbreviation: 'NY', name: 'New York' },
    { abbreviation: 'NC', name: 'North Carolina' },
    { abbreviation: 'ND', name: 'North Dakota' },
    { abbreviation: 'OH', name: 'Ohio' },
    { abbreviation: 'OK', name: 'Oklahoma' },
    { abbreviation: 'OR', name: 'Oregon' },
    { abbreviation: 'PA', name: 'Pennsylvania' },
    { abbreviation: 'RI', name: 'Rhode Island' },
    { abbreviation: 'SC', name: 'South Carolina' },
    { abbreviation: 'SD', name: 'South Dakota' },
    { abbreviation: 'TN', name: 'Tennessee' },
    { abbreviation: 'TX', name: 'Texas' },
    { abbreviation: 'UT', name: 'Utah' },
    { abbreviation: 'VT', name: 'Vermont' },
    { abbreviation: 'VA', name: 'Virginia' },
    { abbreviation: 'WA', name: 'Washington' },
    { abbreviation: 'WV', name: 'West Virginia' },
    { abbreviation: 'WI', name: 'Wisconsin' },
    { abbreviation: 'WY', name: 'Wyoming' },
  ];
  constructor(private router: Router,private fb: FormBuilder, private auth: AuthService, private userService: UserService) {
  }
  async test(event) {
    event.preventDefault();
    let formValue: any = this.profileForm.value;
    delete formValue.password;
    delete formValue.passwordCheck;
    if(this.profileForm.valid) {
      let results = await this.auth.register(this.profileForm.get('email').value, this.profileForm.get('password').value);
      console.log('registration results', results);
      
      if(results) {
        this.auth.reload();
        await updateProfile(this.auth.getUser(), {displayName: formValue.firstName + ' ' + formValue.lastName, photoURL: undefined});
        this.auth.reload();
        formValue.uid = this.auth.getUID();
        let userResult = await this.userService.createUser(formValue);
        console.log('saved user profile: ', userResult);
        this.alertMessage = undefined;
        this.route('/profile');
      } else {
        this.alertMessage = 'Something went wrong with registration';
      }
      
    } else {
      console.log('test');
      this.alertMessage = 'Something you entered below is wrong!';
    }
    
  }
  route(path) {
    this.router.navigate([path],{queryParamsHandling: 'merge'});
  }
}

export const passwordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const pass1 = control.get('password');
  const pass2 = control.get('passwordCheck');
  return pass1 && pass2 && pass1.value !== pass2.value ? { passwordMismatch: true } : null;
};