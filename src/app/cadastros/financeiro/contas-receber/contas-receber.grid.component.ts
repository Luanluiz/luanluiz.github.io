import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {NgxSpinnerService} from 'ngx-spinner';
import {LINK} from '../../clientes/cliente.grid.component';
import {catchError, map, switchMap} from 'rxjs/operators';
import {ContasReceberModel} from './contas-receber.model';
import {ActivatedRoute, Router} from '@angular/router';
import {FinanceiroUtil} from '../financeiro-util';
import {GridComponent} from '../../grid.component';
import {of} from 'rxjs'
import {ToasterService} from '../../ToasterService';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['contas-receber.grid.component.css'],
    templateUrl: 'contas-receber.grid.component.html'
})
export class ContasReceberGridComponent extends GridComponent implements OnInit, AfterViewInit {

    displayedColumns: string[] = ['nome', 'documento', 'tipoDocumento', 'emissao', 'vencimento', 'valor', 'status', 'acoes'];
    dataSource = new MatTableDataSource<ContasReceberModel>();

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private http: HttpClient, private spinner: NgxSpinnerService, private router: Router,
                private activatedRoute: ActivatedRoute, public mat: MatPaginatorIntl, public toaster: ToasterService) {
        super(mat);
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    ngOnInit() {
        this.carregarDados();
    }

    public excluir(receber: ContasReceberModel) {
        this.http.post(`${LINK}financeiro/deletar`, receber)
            .pipe(
                catchError((error) => of(error))
            )
            .subscribe((error: HttpErrorResponse) => {
                if (error) {
                    this.toaster.warning(error.error.message)
                    return;
                }
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
        this.router.navigateByUrl(`/cadastros/contas-receber/baixa/${id}`);
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
