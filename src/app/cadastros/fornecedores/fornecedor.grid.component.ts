import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import {HttpClient} from '@angular/common/http';
import {NgxSpinnerService} from 'ngx-spinner';
import {map} from 'rxjs/operators';
import {LINK} from '../clientes/cliente.grid.component';
import {FornecedorModel} from './fornecedor.model';
import {GridComponent} from '../grid.component';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['fornecedor.grid.component.css'],
    templateUrl: 'fornecedor.grid.component.html',
})
export class FornecedorGridComponent extends GridComponent implements OnInit, AfterViewInit {

    displayedColumns: string[] = ['id', 'nome', 'cpfCnpj', 'estado', 'cidade', 'acoes'];
    dataSource = new MatTableDataSource<FornecedorModel>();

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private http: HttpClient, private spinner: NgxSpinnerService, public mat: MatPaginatorIntl) {
        super(mat);
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    ngOnInit() {
        this.carregarDados();
    }

    public excluir(cliente: FornecedorModel) {
        this.http.post(`${LINK}entidades/deletar`, cliente)
            .subscribe(() => {
                setTimeout(() => this.carregarDados());
            });
    }

    private carregarDados() {
        this.spinner.show();
        this.http.get(`${LINK}entidades/listFornecedor`)
            .pipe(
                map((clientes: Array<FornecedorModel>) => (clientes))
            )
            .subscribe((clientes) => {
                this.dataSource.data = clientes;
                setTimeout(() => this.spinner.hide(), 1000);
            })
    }
}
