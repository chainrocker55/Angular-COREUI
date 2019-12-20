import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'flex-time',
    templateUrl: './flex-time.component.html',
    // styleUrls: ['./flex-combo.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => FlexTime),
        multi: true
    }]
})
export class FlexTime implements ControlValueAccessor {

    @Input() placeholder: string;
    @Input() label: string;
    @Output() change = new EventEmitter();

    // tags is no longer an input of our component, we have writeValue to handle that logic now
    value: Date;

    // // we give some disabled style
    // @HostBinding('class.disabled')
    disabled: boolean = false;
    //   date: Date;

    // we store the two callbacks that Angular gives us
    // we also provide defaults so that our component can be used standalone
    onChange: (value: any) => void = () => { };
    onTouched: Function = () => { };

    constructor() {
        // this.value = moment("2019-01-01", 'YYYY-MM-DD').toDate();
        //   let m = moment("2019-01-01", 'YYYY-MM-DD');
        //   console.log(m);
        //   console.log(m.toDate());
        //   console.log(this.date);
    }


    // writeValue is called by Angular when the input value changes
    writeValue(value: any) {

        // this.value = value;
        // this.value.setTime(value);

        let m: moment.Moment;
        if (value) {
            m = moment("1990-01-01 " + value, 'YYYY-MM-DD HH:mm:ss');
            console.log("1990-01-01 " + value);
        }
        else {
            m = moment("1990-01-01 ", 'YYYY-MM-DD');
        }

        this.value = m.toDate();
        
        // console.log(value);
        // console.log(this.value);
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

    onValueChange(event) {
        // console.log(event);
        // console.log(this.date);

        this.onChange(this.value.toLocaleTimeString('it-IT'));
        this.onTouched();
        this.change.emit(event);
    }

}