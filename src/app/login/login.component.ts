import {FormComponent} from '../cadastros/form.component';
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from './auth-service';
import {BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['login.component.scss'],
    templateUrl: 'login.component.html'
})
export class LoginComponent extends FormComponent implements OnInit {

    private formSubmitAttempt: boolean;
    hide = true;

    constructor(private fb: FormBuilder, public authService: AuthService) {
        super();
    }

    ngOnInit() {
        this.form$ = new BehaviorSubject<FormGroup>(this.fb.group({
            userName: ['', Validators.required],
            password: ['', Validators.required]
        }));
    }

    isFieldInvalid(field: string) {
        return this.getControl(field)
            .pipe(map((c) => {
                if (c.hasError('required')) {
                    return 'Campo obrigatório';
                }
                return '';
            }));
    }

    onSubmit() {

        this.authService.login(this.form$);
        this.formSubmitAttempt = true;
    }
}
