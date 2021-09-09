import {FormComponent} from '../form.component';
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, merge, Observable} from 'rxjs';
import {filter, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {LINK} from '../clientes/cliente.crud.component';
import {UsuarioModel} from './usuario.model';
import {ClienteModel} from '../clientes/cliente.model';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['usuario.crud.component.css'],
    templateUrl: 'usuario.crud.component.html',
})
export class UsuarioCrudComponent extends FormComponent implements OnInit {

    hide = true;
    public nome$: BehaviorSubject<string>;
    public email$: BehaviorSubject<string>;
    public cliente$: Observable<Array<ClienteModel>>;

    constructor(public formBuilder: FormBuilder, public activatedRoute: ActivatedRoute, private spinner: NgxSpinnerService,
                private http: HttpClient, private router: Router) {
        super();
        this.form$ = new BehaviorSubject<FormGroup>(this.formBuilder.group(new UsuarioModel()));
        this.nome$ = new BehaviorSubject<string>('');
        this.email$ = new BehaviorSubject<string>('');
        this.cliente$ = this.http.get<ClienteModel[]>(`${LINK}entidades/listCliente`)
            .pipe(map((dados) => dados));
    }

    ngOnInit() {

        this.addSubscription(this.activatedRoute.params
            .pipe(
                filter((param) => param[`id`]),
                withLatestFrom(this.form$, (params: Params, form: FormGroup) => ({params, form})),
                switchMap((obj: { params: Params, form: FormGroup }) => {
                    this.spinner.show();
                    return this.http.get(`${LINK}usuario/usuario/${obj.params['id']}`)
                        .pipe(map((dado: UsuarioModel) => ({dado, form: obj.form})));
                }),
            )
            .subscribe((obj: { dado: UsuarioModel, form: FormGroup }) => {
                obj.form.patchValue(obj.dado);
                this.spinner.hide();
            }));

        this.addSubscription(this.form$
            .subscribe((form) => {
                form.markAllAsTouched();
            }));

        this.addSubscription(this.getValueChanges('nome')
            .subscribe((nome) => this.nome$.next(nome)));

        this.addSubscription(this.getValueChanges('email')
            .subscribe((nome) => this.email$.next(nome)));

        this.disableComponents();
        this.obrigatorio();
    }

    gravar() {
        this.addSubscription(this.form$
            .pipe(
                switchMap((form: FormGroup) => {
                    this.spinner.show();
                    const usuario: UsuarioModel = form.getRawValue();
                    return this.http.post(`${LINK}usuario/salvar`, usuario)
                        .pipe(map((u: UsuarioModel) => u));
                }))
            .subscribe((u) => {
                this.spinner.hide();
                this.router.navigate(['/cadastros/usuario'])
            }));
    }

    private obrigatorio() {

        this.addSubscription(merge(this.getControl('nome'), this.getControl('usuario'),
            this.getControl('senha'))
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
    }
}
