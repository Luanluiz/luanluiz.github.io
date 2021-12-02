import {FormComponent} from '../form.component';
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BehaviorSubject, Observable} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {HttpClient} from '@angular/common/http';
import {CaixaModel} from './caixa.model';
import {filter, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {LINK} from '../clientes/cliente.crud.component';


@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'caixa.form.component.html'
})
export class CaixaFormComponent extends FormComponent implements OnInit {

    public entrada$: BehaviorSubject<boolean>;

    constructor(public formBuilder: FormBuilder, public activatedRoute: ActivatedRoute, private spinner: NgxSpinnerService,
                private http: HttpClient, private router: Router) {
        super();

        this.form$ = new BehaviorSubject<FormGroup>(this.formBuilder.group(new CaixaModel()));
        this.entrada$ = new BehaviorSubject<boolean>(true);
    }

    ngOnInit(): void {

        this.addSubscription(this.activatedRoute.params
            .pipe(
                filter((param) => param[`id`]),
                withLatestFrom(this.form$, (params: Params, form: FormGroup) => ({params, form})),
                switchMap((obj: { params: Params, form: FormGroup }) => {
                    this.spinner.show();
                    return this.http.get(`${LINK}caixa/caixa/${obj.params['id']}`)
                        .pipe(map((dado: CaixaModel) => ({dado, form: obj.form})));
                }),
            )
            .subscribe((obj: { dado: CaixaModel, form: FormGroup }) => {
                obj.form.patchValue(obj.dado);
                this.entrada$.next(obj.dado.entrada > 0);
                Object.keys(obj.dado).forEach((key => {
                    obj.form.get(key).disable();
                }))
                this.spinner.hide();
            }));
    }

}
