import {FormComponent} from '../form.component';
import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import {map, switchMap} from 'rxjs/operators';
import {LINK} from '../clientes/cliente.grid.component';
import {HttpClient} from '@angular/common/http';
import {NgxSpinnerService} from 'ngx-spinner';
import {ActivatedRoute} from '@angular/router';
import {ContratoModel} from './contrato.model';
import {GridComponent} from '../grid.component';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'contrato.grid.component.html'
})
export class ContratoGridComponent extends GridComponent implements OnInit, AfterViewInit {

    public titulo$: BehaviorSubject<String>;

    displayedColumns: string[] = ['id', 'nomeEntidade', 'dataInicio', 'tempo', 'valor', 'acoes'];
    dataSource = new MatTableDataSource<ContratoModel>();

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private http: HttpClient, private spinner: NgxSpinnerService, private activatedRouter: ActivatedRoute,
                public mat: MatPaginatorIntl) {
        super(mat);
        this.titulo$ = new BehaviorSubject<String>('Cadastro de Contratos');
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    ngOnInit() {
        this.carregarDados();
    }

    public excluir(contrato: ContratoModel) {
        this.http.post(`${LINK}contratos/deletar`, contrato)
            .subscribe(() => {
                setTimeout(() => this.carregarDados());
            });
    }

    private carregarDados() {
        this.spinner.show();

        this.addSubscription(this.activatedRouter.queryParams
            .pipe(
                switchMap((params) => {
                    return this.http.get(`${LINK}contratos/listaContrato`)
                        .pipe(
                            map((contrato: Array<ContratoModel>) => (contrato))
                        )
                })
            )
            .subscribe((contato) => {
                this.dataSource.data = contato;
                setTimeout(() => this.spinner.hide(), 1000);
            }));
    }
}
