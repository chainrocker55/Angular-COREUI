import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, Input, forwardRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'flex-combo',
  templateUrl: './flex-combo.component.html',
  // styleUrls: ['./flex-combo.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FlexCombo),
    multi: true
  }]
})
export class FlexCombo implements ControlValueAccessor {

  @Input() datasource: any;
  @Input() showAll: boolean;
  // @Input() id: string;
  // @Input() name: string;
  @Input() placeholder: string;
  // @Input() ngModel: any;
  // @Input() disabled: boolean;

  @Output() change = new EventEmitter();

  // tags is no longer an input of our component, we have writeValue to handle that logic now
  selectedValue: any;

  // // we give some disabled style
  // @HostBinding('class.disabled')
  disabled: boolean = false;

  // we store the two callbacks that Angular gives us
  // we also provide defaults so that our component can be used standalone
  onChange: (value: any) => void = () => { };
  onTouched: Function = () => { };

  constructor() { }


  // writeValue is called by Angular when the input value changes
  writeValue(value: any) {
    this.selectedValue = value;
  }

  // registerOnChange is called by Angular
  // this is the opportunity for us to save the onChange callback
  // we use this callback to "output" new values
  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  // registerOnTouched is called by Angular
  // this is the opportunity for us to save the onTouched callback
  // we use this callback to notify Angular when our component has been touched
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  // setDisabledState is called by Angular
  // this is the opportunity for us to adjust our component style and logic
  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }


  onSelectedChange(event) {
    this.onChange(event);
    this.onTouched();
    this.change.emit(event);    

  }

}