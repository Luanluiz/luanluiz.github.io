import {FormComponent} from '../form.component';
import {Directive, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {BaixaFinanceiroModel} from './baixa-financeiro.model';
import {catchError, filter, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {FinanceiroModel} from './financeiro.model';
import {LINK} from '../clientes/cliente.grid.component';
import {ClienteModel} from '../clientes/cliente.model';
import {ToasterService} from '../ToasterService';


@Directive()
export abstract class BaixaFinanceiroFormComponentDirective extends FormComponent implements OnInit {

    public formDocumento$: BehaviorSubject<FormGroup>;
    public cliente$: Observable<Array<ClienteModel>>;
    public idFinanceiro: number;
    public tipoFinanceiro: string;

    protected constructor(public formBuilder: FormBuilder, public activatedRoute: ActivatedRoute, public spinner: NgxSpinnerService,
                          public tipo, public http: HttpClient, public router: Router, public toaster: ToasterService) {
        super();
        this.form$ = new BehaviorSubject<FormGroup>(this.formBuilder.group(new BaixaFinanceiroModel()));
        this.formDocumento$ = new BehaviorSubject<FormGroup>(this.formBuilder.group(new FinanceiroModel()));
        this.idFinanceiro = 0;
        this.tipoFinanceiro = tipo;
        this.cliente$ = this.http.get<ClienteModel[]>(`${LINK}entidades/listEntidades`)
            .pipe(map((dados) => dados));
    }

    public ngOnInit() {

        this.addSubscription(this.formDocumento$
            .subscribe((form) => {
                form.get('nomeEntidade')?.disable();
                form.get('documento')?.disable();
                form.get('tipoDocumento')?.disable();
                form.get('emissao')?.disable();
                form.get('vencimento')?.disable();
                form.get('valor')?.disable();
                form.get('id')?.disable();
            }));

        this.activatedRoute.params
            .pipe(
                filter((param) => param[`id`]),
                withLatestFrom(this.formDocumento$, (params: Params, form: FormGroup) => ({params, form})),
                switchMap((obj: { params: Params, form: FormGroup }) => {
                    this.spinner.show();
                    this.idFinanceiro = +obj.params[`id`];

                    return this.http.get(`${LINK}financeiro/financeiro/${obj.params[`id`]}`)
                        .pipe(map((dado) => ({dado, form: obj.form})));
                })
            )
            .subscribe((obj: { dado: any, form: FormGroup }) => {
                this.spinner.hide();
                obj.form.patchValue(obj.dado);
            });

        this.addSubscription(this.form$
            .subscribe((form) => {
                form.markAllAsTouched();
            }));

        this.addSubscription(this.getControl('valor')
            .subscribe((control) => control.setValidators([Validators.required, Validators.min(0.01)])));

        this.addSubscription(this.getControl('meioPagamento')
            .subscribe((control) => control.setValidators([Validators.required, Validators.minLength(1)])))

    }

    baixar() {
        this.form$
            .pipe(
                switchMap((form: FormGroup) => {
                    this.spinner.show();
                    const financeiro: BaixaFinanceiroModel = form.getRawValue();
                    financeiro.idFinanceiro = this.idFinanceiro;
                    return this.http.post(`${LINK}baixa/salvar`, financeiro)
                        .pipe(
                            map((f) => (f)),
                            catchError((error) => of({error}))
                        );
                }))
            .subscribe((obj: { f?: FinanceiroModel, error?: HttpErrorResponse }) => {
                this.spinner.hide();
                if (obj && obj.error) {
                    this.toaster.error(obj.error.error.message);
                    return;
                }
                this.router.navigateByUrl(this.tipoFinanceiro === 'P' ? '/cadastros/contas-pagar' : '/cadastros/contas-receber')
            });
    }
}
