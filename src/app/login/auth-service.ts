import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Router} from '@angular/router';
import {FormGroup} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {map, switchMap} from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';
import {LINK} from '../cadastros/clientes/cliente.grid.component';

export interface User {
    userName: string;
    password: string;
}

@Injectable()
export class AuthService {
    private loggedIn = new BehaviorSubject<boolean>(false); // {1}
    public _msg$ = new BehaviorSubject<string>('');

    get isLoggedIn() {
        return this.loggedIn.asObservable(); // {2}
    }

    get msg$() {
        return this._msg$.asObservable();
    }

    constructor(private router: Router, private spinner: NgxSpinnerService, private http: HttpClient) {
    }

    login(form$: Observable<FormGroup>) {
        this.spinner.show();
        form$
            .pipe(
                switchMap((form) => {
                    const usuario = form.get('userName')?.value;
                    const senha = form.get('password')?.value;

                    const params = new HttpParams()
                        .set('usuario', usuario)
                        .set('senha', senha);

                    return this.http.get<boolean>(`${LINK}usuario/login`, {params})
                        .pipe(
                            map((ok: boolean) => ({ok, form})),
                        );
                }),
            )
            .subscribe((obj: { ok: boolean, form: FormGroup }) => {
                this.spinner.hide();
                this._msg$.next('');

                if (obj && obj.ok) {
                    localStorage.setItem('login', JSON.stringify(obj.form.getRawValue()));
                    this.loggedIn.next(true);
                    this.router.navigate(['/dashboard']);
                } else {
                    this._msg$.next('Usuário ou senha invalidos');
                    localStorage.removeItem('login');
                }
            });
    }


    public logout() {                            // {4}
        localStorage.removeItem('login');
        this.loggedIn.next(false);
        this.router.navigate(['/login']);
    }
}
