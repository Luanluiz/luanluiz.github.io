import {Directive, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {AbstractControl, FormGroup} from '@angular/forms';
import {map} from 'rxjs/operators';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class FormComponent implements OnDestroy {

    public form$: BehaviorSubject<FormGroup>;

    private subscription: Subscription;

    protected constructor() {
        this.subscription = new Subscription();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    public addSubscription(subscription: Subscription) {
        this.subscription.add(subscription);
    }

    public getControl(controlName: string,
                      form$: BehaviorSubject<FormGroup> = this.form$): Observable<AbstractControl> {

        return form$.pipe(
            map((fg: FormGroup) => {
                const control: AbstractControl = fg.get(controlName);
                if (!control) {
                    throw new Error('Campo não existe: ' + controlName);
                }
                return control;
            }));
    }

    public getValueChanges(controlName: string,
                              form$: BehaviorSubject<FormGroup> = this.form$): Observable<any> {
        const control: AbstractControl = form$.getValue().get(controlName);
        if (!control) {
            throw new Error("Campo não existe: " + controlName);
        }
        return control.valueChanges;
    }

    public getErrorMessage(control: string): Observable<string> {
        return this.getControl(control)
            .pipe(map((c) => {
                if (c.hasError('required')) {
                    return 'Campo obrigatório';
                }
                return c.hasError('email') ? 'Email inválido' : '';
            }));
    }
}
