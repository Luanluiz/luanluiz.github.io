import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {HttpClient} from '@angular/common/http';
import {NgxSpinnerService} from 'ngx-spinner';
import {LINK} from '../../clientes/cliente.grid.component';
import {map, switchMap} from 'rxjs/operators';
import {ContasPagarModel} from './contas-pagar.model';
import {ActivatedRoute, Router} from '@angular/router';
import {FinanceiroUtil} from '../financeiro-util';
import {ContasReceberModel} from '../contas-receber/contas-receber.model';
import {FormComponent} from '../../form.component';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['contas-pagar.grid.component.css'],
    templateUrl: 'contas-pagar.grid.component.html'
})
export class ContasPagarGridComponent extends FormComponent implements OnInit, AfterViewInit {

    displayedColumns: string[] = ['nome', 'documento', 'tipoDocumento', 'emissao', 'vencimento', 'valor', 'status', 'acoes'];
    dataSource = new MatTableDataSource<ContasPagarModel>();

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private http: HttpClient, private spinner: NgxSpinnerService, private router: Router,
                private activatedRoute: ActivatedRoute) {
        super();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    ngOnInit() {
        this.carregarDados();
    }

    public excluir(pagar: ContasPagarModel) {
        this.http.post(`${LINK}financeiro/deletar`, pagar)
            .subscribe(() => {
                setTimeout(() => this.carregarDados());
            });
    }

    public quitado(c: ContasPagarModel) {
        return c.status === 'Quitado';
    }

    public vencido(p: ContasPagarModel) {
        return new Date(p.vencimento) < new Date() && p.status !== 'Quitado';
    }

    public vencendo(p: ContasPagarModel) {
        const data1 = new Date(p.vencimento + ' 00:00:00');
        const today = new Date();
        return data1.getDate() === today.getDate() && data1.getMonth() === today.getMonth()
            && data1.getFullYear() === today.getFullYear() && p.status !== 'Quitado';
    }

    baixar(id: number) {
        const param = {tipo: 'R'};
        this.router.navigateByUrl(`/cadastros/contas-receber/baixa/${id}`, {queryParams: param});
    }

    public getTotal() {
        if (this.dataSource.data.length > 0) {

            return this.dataSource.data.map(t => t.valor).reduce((value1, value2) => value1 + value2, 0);
        } else {
            return 0;
        }
    }

    private carregarDados() {
        this.spinner.show();
        this.addSubscription(this.activatedRoute.queryParams
            .pipe(
                switchMap((params) => {

                    return this.http.get(`${LINK}financeiro/${FinanceiroUtil.getUrl(params, false)}`)
                        .pipe(
                            map((pagar: Array<ContasPagarModel>) => (pagar))
                        )
                })
            )
            .subscribe((r) => {
                this.dataSource.data = r;
                setTimeout(() => this.spinner.hide(), 1000);
            }));
    }
}
