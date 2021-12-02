import {FormComponent} from '../form.component';
import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import {HttpClient} from '@angular/common/http';
import {NgxSpinnerService} from 'ngx-spinner';
import {ActivatedRoute} from '@angular/router';
import {CaixaModel} from './caixa.model';
import {LINK} from '../clientes/cliente.grid.component';
import {map} from 'rxjs/operators';
import {GridComponent} from '../grid.component';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'caixa.grid.component.html',
    styleUrls: ['caixa.grid.component.scss']
})
export class CaixaGridComponent extends GridComponent implements OnInit, AfterViewInit {

    public titulo$: BehaviorSubject<String>;
    public saldo$: BehaviorSubject<number>;

    displayedColumns: string[] = ['id', 'meioPagamento', 'historico', 'data', 'entrada', 'saida'];
    dataSource = new MatTableDataSource<CaixaModel>();

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private http: HttpClient, private spinner: NgxSpinnerService, private activatedRouter: ActivatedRoute,
                public mat: MatPaginatorIntl) {
        super(mat);
        this.titulo$ = new BehaviorSubject<String>('Caixa');
        this.saldo$ = new BehaviorSubject<number>(0);
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    ngOnInit(): void {

        this.carregarDados();
        this.carregarSaldo();
    }

    private carregarSaldo() {
        this.http.get(`${LINK}caixa/saldo`)
            .pipe(
                map((saldo: number) => saldo)
            )
            .subscribe(this.saldo$);
    }

    private carregarDados() {
        this.spinner.show();
        this.http.get(`${LINK}caixa/lista`)
            .pipe(
                map((caixa: Array<CaixaModel>) => (caixa))
            )
            .subscribe((u) => {
                this.dataSource.data = u;
                setTimeout(() => this.spinner.hide(), 1000);
            })
    }
}
