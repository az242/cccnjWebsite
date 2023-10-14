import { AbstractControl, FormArray, ValidationErrors } from "@angular/forms";

export const requireAtLeastOne = (control: AbstractControl): ValidationErrors | null => {
    const items = control as FormArray;
  
    if (!items || items.length === 0) {
      return { requireAtLeastOne: true };
    }
  
    return null;
}