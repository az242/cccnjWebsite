import { AbstractControl, FormArray, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const passwordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const pass1 = control.get('password');
    const pass2 = control.get('passwordCheck');
    return pass1 && pass2 && pass1.value !== pass2.value ? { passwordMismatch: true } : null;
};
/**
 * Validation function to make sure string meets complexity rules
 * - one uppercase letter
 * - one lowercase letter
 * - one digit
 * - atleast 6 characters long
 * @param control 
 * @returns Validation Error 'complexity'
 */
export const passwordComplexityValidator = (control: AbstractControl): ValidationErrors | null => {
    // Define your password complexity rules here
    const password = control.value;
    // Example: Require at least one uppercase letter, one lowercase letter, and one digit
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!regex.test(password) || password.length < 6) {
        return { complexity: true };
    }
    return null;
}
/**
 * validation function for zip codes
 * format: XXXXX-ZZZZ
 * @param control 
 * @returns Validation Error 'invalidZip'
 */
export const validateUSZipCode = (control: AbstractControl): ValidationErrors | null => {
    const zip = control.value;
    // Define a regular expression pattern for U.S. ZIP codes
    var zipCodePattern = /^\d{5}(?:-\d{4})?$/;
    if (!zipCodePattern.test(zip)) {
        return { invalidZip: true };
    }
    return null;
}
/**
 *  Applies to FormArrays and validates there is atleast one control in the array
 * @param control 
 * @returns An error map with the `requireAtLeastOne` property if the validation check fails, otherwise `null`.
 */
export const requireAtLeastOne = (control: AbstractControl): ValidationErrors | null => {
    const items = control as FormArray;
  
    if (!items || items.length === 0) {
      return { requireAtLeastOne: true };
    }
  
    return null;
}
export const americanStates = [
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