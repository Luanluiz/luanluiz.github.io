import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import {ClienteModel} from './cliente.model';
import {HttpClient} from '@angular/common/http';
import {map, switchMap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {MatProgressSpinner, MatSpinner} from '@angular/material/progress-spinner';
import {NgxSpinnerService} from 'ngx-spinner';
import {BehaviorSubject} from 'rxjs';
import {FormComponent} from '../form.component';
import {ActivatedRoute} from '@angular/router';
import {GridComponent} from '../grid.component';

export const LINK = environment.apiUrl;

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'cliente.grid.component.html',
    styleUrls: ['cliente.grid.component.css']
})
export class ClienteGridComponent extends GridComponent implements OnInit, AfterViewInit {

    public titulo$: BehaviorSubject<String>;

    displayedColumns: string[] = ['id', 'nome', 'cpfCnpj', 'estado', 'cidade', 'acoes'];
    dataSource = new MatTableDataSource<ClienteModel>();

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private http: HttpClient, private spinner: NgxSpinnerService, private activatedRouter: ActivatedRoute,
                public mat: MatPaginatorIntl) {
        super(mat);
        this.titulo$ = new BehaviorSubject<String>('Cadastro de Clientes');
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    ngOnInit() {
        this.carregarDados();
    }

    public excluir(cliente: ClienteModel) {
        this.http.post(`${LINK}entidades/deletar`, cliente)
            .subscribe(() => {
                setTimeout(() => this.carregarDados());
            });
    }

    private carregarDados() {
        this.spinner.show();

        this.addSubscription(this.activatedRouter.queryParams
            .pipe(
                switchMap((params) => {
                    let endpoint = 'listCliente';
                    if (params['socio']) {
                        endpoint = 'socios'
                        this.titulo$.next('Sócios torcedores');
                    } else {
                        this.titulo$.next('Cadastro de Clientes');
                    }
                    return this.http.get(`${LINK}entidades/${endpoint}`)
                        .pipe(
                            map((clientes: Array<ClienteModel>) => (clientes))
                        )
                })
            )
            .subscribe((clientes) => {
                this.dataSource.data = clientes;
                setTimeout(() => this.spinner.hide(), 1000);
            }));
    }
}
