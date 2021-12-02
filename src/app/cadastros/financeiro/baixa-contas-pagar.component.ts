import {BaixaFinanceiroFormComponentDirective} from './baixa-financeiro-form-component.directive';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ToasterService} from '../ToasterService';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'baixa-financeiro.form.component.html',
})
export class BaixaContasPagarComponent extends BaixaFinanceiroFormComponentDirective {

    constructor(public formBuilder: FormBuilder, public activatedRoute: ActivatedRoute, public spinner: NgxSpinnerService,
                public http: HttpClient, public router: Router, public toaster: ToasterService) {
        super(formBuilder, activatedRoute, spinner, 'P', http, router, toaster);
    }
}
