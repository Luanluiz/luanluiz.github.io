import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BehaviorSubject, merge, Observable} from 'rxjs';
import {ClienteModel} from './cliente.model';
import {filter, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {FormComponent} from '../form.component';

export const LINK = environment.apiUrl;

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'cliente.crud.component.html'
})
export class ClienteCrudComponent extends FormComponent implements OnInit {

    constructor(public formBuilder: FormBuilder, public activatedRoute: ActivatedRoute, private spinner: NgxSpinnerService,
                private http: HttpClient, private router: Router) {
        super();
        this.form$ = new BehaviorSubject<FormGroup>(this.formBuilder.group(new ClienteModel()));
    }

    ngOnInit() {

        this.addSubscription(this.activatedRoute.params
            .pipe(
                filter((param) => param[`id`]),
                withLatestFrom(this.form$, (params: Params, form: FormGroup) => ({params, form})),
                switchMap((obj: { params: Params, form: FormGroup }) => {
                    this.spinner.show();
                    return this.http.get(`${LINK}entidades/entidade/${obj.params['id']}`)
                        .pipe(map((dado: ClienteModel) => ({dado, form: obj.form})));
                }),
            )
            .subscribe((obj: { dado: ClienteModel, form: FormGroup }) => {
                obj.form.patchValue(obj.dado);
                this.spinner.hide();
            }));

        this.addSubscription(this.form$
            .subscribe((form) => {
                form.markAllAsTouched();
            }));

        this.disableComponents();
        this.obrigatorio();
    }

    gravar() {
        this.addSubscription(this.form$
            .pipe(
                switchMap((form: FormGroup) => {
                    this.spinner.show();
                    const cliente: ClienteModel = form.getRawValue();
                    return this.http.post(`${LINK}entidades/salvar`, cliente)
                        .pipe(map((c: ClienteModel) => c));
                }))
            .subscribe((cliente) => {
                this.spinner.hide();
                this.router.navigate(['/cadastros/clientes'])
            }));
    }

    private obrigatorio() {

        this.addSubscription(
            merge(this.getControl('nome'), this.getControl('cpfCnpj'),
                this.getControl('endereco'), this.getControl('cidade'), this.getControl('estado'),
                this.getControl('cep')
            )
                .subscribe((control) => {
                    control.setValidators([Validators.required]);
                })
        );

        this.addSubscription(this.getControl('email')
            .subscribe((control) => control.setValidators([Validators.required, Validators.email])));
    }

    private disableComponents() {
        this.addSubscription(this.getControl('id')
            .subscribe((control) => control.disable()));

        this.addSubscription(this.getControl('cliente')
            .subscribe((control) => control.disable()));

        this.addSubscription(this.getControl('socio')
            .subscribe((control) => control.disable()));
    }
}
