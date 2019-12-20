import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl } from '@angular/forms';

@Directive({
  selector: '[flexMin][formControlName],[flexMin][formControl],[flexMin][ngModel]',
  providers: [{provide: NG_VALIDATORS, useExisting: FlexMinDirective, multi: true}]
})
export class FlexMinDirective implements Validator {
  @Input()
  flexMin: number;
  
  validate(c: FormControl): {[key: string]: any} {
      let v = c.value;
      return ( v < this.flexMin)? {"flexMin": true} : null;
  }
} 