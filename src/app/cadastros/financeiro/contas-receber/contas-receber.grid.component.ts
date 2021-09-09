import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {HttpClient} from '@angular/common/http';
import {NgxSpinnerService} from 'ngx-spinner';
import {LINK} from '../../clientes/cliente.grid.component';
import {map, switchMap} from 'rxjs/operators';
import {ContasReceberModel} from './contas-receber.model';
import {ActivatedRoute, Router} from '@angular/router';
import {FormComponent} from '../../form.component';
import {TipoFiltroFinanceiro} from '../../../enuns/tipo-filtro-financeiro';
import NumberFormat = Intl.NumberFormat;
import {FinanceiroUtil} from '../financeiro-util';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['contas-receber.grid.component.css'],
    templateUrl: 'contas-receber.grid.component.html'
})
export class ContasReceberGridComponent extends FormComponent implements OnInit, AfterViewInit {

    displayedColumns: string[] = ['nome', 'documento', 'tipoDocumento', 'emissao', 'vencimento', 'valor', 'status', 'acoes'];
    dataSource = new MatTableDataSource<ContasReceberModel>();

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

    public excluir(receber: ContasReceberModel) {
        this.http.post(`${LINK}financeiro/deletar`, receber)
            .subscribe(() => {
                setTimeout(() => this.carregarDados());
            });
    }

    public quitado(c: ContasReceberModel) {
        return c.status === 'Quitado';
    }

    public vencido(c: ContasReceberModel) {
        return new Date(c.vencimento) < new Date() && c.status !== 'Quitado';
    }

    public vencendo(c: ContasReceberModel) {
        const data1 = new Date(c.vencimento + ' 00:00:00');
        const today = new Date();
        return data1.getDate() === today.getDate() && data1.getMonth() === today.getMonth()
            && data1.getFullYear() === today.getFullYear() && c.status !== 'Quitado';
    }

    public getTotal() {
        if (this.dataSource.data.length > 0) {

            return this.dataSource.data.map(t => t.valor).reduce((value1, value2) => value1 + value2, 0);
        } else {
            return 0;
        }
    }

    baixar(id: number) {
        const param = {tipo: 'P'};
        this.router.navigateByUrl(`/cadastros/contas-receber/baixa/${id}`, {queryParams: param});
    }

    private carregarDados() {
        this.spinner.show();
        this.addSubscription(this.activatedRoute.queryParams
            .pipe(
                switchMap((params) => {

                    return this.http.get(`${LINK}financeiro/${FinanceiroUtil.getUrl(params)}`)
                        .pipe(
                            map((receber: Array<ContasReceberModel>) => (receber))
                        )
                })
            )
            .subscribe((r) => {
                this.dataSource.data = r;
                setTimeout(() => this.spinner.hide(), 1000);
            }));

    }


}
