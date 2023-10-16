export const passwordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const pass1 = control.get('password');
    const pass2 = control.get('passwordCheck');
    return pass1 && pass2 && pass1.value !== pass2.value ? { passwordMismatch: true } : null;
};
export const passwordComplexityValidator = (control: FormControl) => {
    // Define your password complexity rules here
    const password = control.value;
    // Example: Require at least one uppercase letter, one lowercase letter, and one digit
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!regex.test(password)) {
        return { complexity: true };
    }
    return null;
}
export const validateUSZipCode = (postalCode) => {
    // Define a regular expression pattern for U.S. ZIP codes
    var zipCodePattern = /^\d{5}(?:-\d{4})?$/;
  
    // Test the postal code against the pattern
    return zipCodePattern.test(postalCode);
  }