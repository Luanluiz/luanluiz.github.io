import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {HttpClient} from '@angular/common/http';
import {NgxSpinnerService} from 'ngx-spinner';
import {map} from 'rxjs/operators';
import {LINK} from '../clientes/cliente.grid.component';
import {UsuarioModel} from './usuario.model';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['usuario.grid.component.css'],
    templateUrl: 'usuario.grid.component.html',
})
export class UsuarioGridComponent implements OnInit, AfterViewInit {

    displayedColumns: string[] = ['id', 'nome', 'email', 'usuario', 'acoes'];
    dataSource = new MatTableDataSource<UsuarioModel>();

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private http: HttpClient, private spinner: NgxSpinnerService) {
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    ngOnInit() {
        this.carregarDados();
    }

    public excluir(usuario: UsuarioModel) {
        this.http.post(`${LINK}usuario/deletar`, usuario)
            .subscribe(() => {
                setTimeout(() => this.carregarDados());
            });
    }

    private carregarDados() {
        this.spinner.show();
        this.http.get(`${LINK}usuario/listUsuario`)
            .pipe(
                map((usuarios: Array<UsuarioModel>) => (usuarios))
            )
            .subscribe((u) => {
                this.dataSource.data = u;
                setTimeout(() => this.spinner.hide(), 1000);
            })
    }
}
