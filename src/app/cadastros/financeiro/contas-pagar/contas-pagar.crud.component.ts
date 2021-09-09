import {FormComponent} from '../../form.component';
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject, merge, Observable} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {HttpClient} from '@angular/common/http';
import {LINK} from '../../clientes/cliente.crud.component';
import {filter, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {FornecedorModel} from '../../fornecedores/fornecedor.model';
import {ContasPagarModel} from './contas-pagar.model';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'contas-pagar.crud.component.html',
})
export class ContasPagarCrudComponent extends FormComponent implements OnInit {

    public fornecedor$: Observable<Array<FornecedorModel>>;

    constructor(public formBuilder: FormBuilder, public activatedRoute: ActivatedRoute, private spinner: NgxSpinnerService,
                private http: HttpClient, private router: Router) {
        super();
        this.form$ = new BehaviorSubject<FormGroup>(this.formBuilder.group(new ContasPagarModel()));
        this.fornecedor$ = this.http.get<FornecedorModel[]>(`${LINK}entidades/listFornecedor`)
            .pipe(map((dados) => dados));
    }

    ngOnInit() {

        this.addSubscription(this.activatedRoute.params
            .pipe(
                filter((param) => param[`id`]),
                withLatestFrom(this.form$, (params: Params, form: FormGroup) => ({params, form})),
                switchMap((obj: { params: Params, form: FormGroup }) => {
                    this.spinner.show();
                    return this.http.get(`${LINK}financeiro/financeiro/${obj.params['id']}`)
                        .pipe(map((dado: ContasPagarModel) => ({dado, form: obj.form})));
                }),
            )
            .subscribe((obj: { dado: ContasPagarModel, form: FormGroup }) => {
                obj.form.patchValue(obj.dado);
                this.spinner.hide();
                this.spinner.hide();
                obj.form.patchValue(obj.dado);
                if (obj.dado.status === 'Quitado') {
                    obj.form.get('nomeEntidade')?.disable();
                    obj.form.get('documento')?.disable();
                    obj.form.get('tipoDocumento')?.disable();
                    obj.form.get('emissao')?.disable();
                    obj.form.get('vencimento')?.disable();
                    obj.form.get('valor')?.disable();
                }
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
                    const pagar: ContasPagarModel = form.getRawValue();
                    return this.http.post(`${LINK}financeiro/salvar`, pagar)
                        .pipe(map((p: ContasPagarModel) => p));
                }))
            .subscribe((pagar) => {
                this.spinner.hide();
                this.router.navigate(['/cadastros/contas-pagar'])
            }));
    }

    private obrigatorio() {

        this.addSubscription(
            merge(this.getControl('documento'),
                this.getControl('tipoDocumento'),
            )
                .subscribe((control) => {
                    control.setValidators([Validators.required]);
                })
        );

        this.addSubscription(
            merge(this.getControl('emissao'),
                this.getControl('vencimento')
            )
                .subscribe((control) => control.setValidators([Validators.required, Validators.nullValidator]))
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
