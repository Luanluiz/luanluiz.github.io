import {FormComponent} from '../form.component';
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject, merge, Observable} from 'rxjs';
import {ClienteModel} from '../clientes/cliente.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LINK} from '../clientes/cliente.crud.component';
import {filter, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {NgxSpinnerService} from 'ngx-spinner';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ContratoModel} from './contrato.model';


@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'contrato.crud.component.html'
})
export class ContratoCrudComponent extends FormComponent implements OnInit {

    public cliente$: Observable<Array<ClienteModel>>;
    public disableSubmit: boolean

    constructor(public formBuilder: FormBuilder, private spinner: NgxSpinnerService, public activatedRoute: ActivatedRoute,
                private http: HttpClient, private router: Router) {
        super();
        this.form$ = new BehaviorSubject<FormGroup>(this.formBuilder.group(new ContratoModel()));
        this.cliente$ = this.http.get<ClienteModel[]>(`${LINK}entidades/listCliente`)
            .pipe(map((dados) => dados));
        this.disableSubmit = false;
    }

    ngOnInit() {

        this.addSubscription(this.activatedRoute.params
            .pipe(
                filter((param) => param[`id`]),
                withLatestFrom(this.form$, (params: Params, form: FormGroup) => ({params, form})),
                switchMap((obj: { params: Params, form: FormGroup }) => {
                    this.spinner.show();
                    return this.http.get(`${LINK}contratos/contrato/${obj.params['id']}`)
                        .pipe(map((dado: ContratoModel) => ({dado, form: obj.form})));
                }),
            )
            .subscribe((obj: { dado: ContratoModel, form: FormGroup }) => {
                this.disableSubmit  = true;
                obj.form.patchValue(obj.dado);
                this.spinner.hide();
                this.spinner.hide();
                obj.form.patchValue(obj.dado);
                obj.form.disable();
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
                    const contrato: ContratoModel = form.getRawValue();
                    return this.http.post(`${LINK}contratos/salvar`, contrato)
                        .pipe(map((c: ContratoModel) => c));
                }))
            .subscribe((contrato) => {
                this.spinner.hide();
                this.router.navigate(['/cadastros/contratos'])
            }));
    }

    private obrigatorio() {

        this.addSubscription(this.getControl('dataInicio')
            .subscribe((control) => control.setValidators([Validators.required, Validators.nullValidator]))
        )

        this.addSubscription(
            merge(
                this.getControl('tempo'),
                this.getControl('diaVencimento')
            )
                .subscribe((control) => control.setValidators([Validators.required, Validators.min(1)]))
        )

        this.addSubscription(this.getControl('valor')
            .subscribe((control) => control.setValidators([Validators.required, Validators.min(0.01)])));

        this.addSubscription(this.getControl('nomeEntidade')
            .subscribe((control) => control.setValidators([Validators.required, Validators.minLength(1)])))

    }

    private disableComponents() {
        this.addSubscription(this.getControl('id')
            .subscribe((control) => control.disable()));

    }
}
