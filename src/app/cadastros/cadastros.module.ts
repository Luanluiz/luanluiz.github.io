import {LOCALE_ID, NgModule} from '@angular/core';
import {ClienteGridComponent} from './clientes/cliente.grid.component';
import {RouterModule, Routes} from '@angular/router';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatRippleModule} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {CommonModule, registerLocaleData} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FornecedorGridComponent} from './fornecedores/fornecedor.grid.component';
import {FornecedorCrudComponent} from './fornecedores/fornecedor.crud.component';
import {ClienteCrudComponent} from './clientes/cliente.crud.component';
import {UsuarioGridComponent} from './usuarios/usuario.grid.component';
import {UsuarioCrudComponent} from './usuarios/usuario.crud.component';
import {MatIconModule} from '@angular/material/icon';
import {ContasReceberGridComponent} from './financeiro/contas-receber/contas-receber.grid.component';
import {ContasReceberCrudComponent} from './financeiro/contas-receber/contas-receber.crud.component';
import {CurrencyMaskModule} from 'ng2-currency-mask';
import localePt from '@angular/common/locales/pt';
import {ContasPagarGridComponent} from './financeiro/contas-pagar/contas-pagar.grid.component';
import {ContasPagarCrudComponent} from './financeiro/contas-pagar/contas-pagar.crud.component';
import {BaixaFinanceiroFormComponent} from './financeiro/baixa-financeiro.form.component';

export const ROUTES: Routes = [

    {
        path: 'clientes',
        component: ClienteGridComponent,
    },

    {
        path: 'cliente/save',
        component: ClienteCrudComponent,
    },
    {
        path: 'cliente/save/:id',
        component: ClienteCrudComponent,
    },

    {
        path: 'fornecedor',
        component: FornecedorGridComponent,
    },
    {
        path: 'fornecedor/save',
        component: FornecedorCrudComponent,
    },
    {
        path: 'fornecedor/save/:id',
        component: FornecedorCrudComponent,
    },

    // usuarios
    {
        path: 'usuario',
        component: UsuarioGridComponent,
    },
    {
        path: 'usuario/save',
        component: UsuarioCrudComponent,
    },
    {
        path: 'usuario/save/:id',
        component: UsuarioCrudComponent,
    },

    // financeiro
    {
        path: 'contas-receber',
        component: ContasReceberGridComponent,
    },
    {
        path: 'contas-receber/save',
        component: ContasReceberCrudComponent,
    },
    {
        path: 'contas-receber/save/:id',
        component: ContasReceberCrudComponent,
    },

    {
        path: 'contas-receber/baixa/:id',
        component: BaixaFinanceiroFormComponent,
    },

    {
        path: 'contas-pagar',
        component: ContasPagarGridComponent,
    },
    {
        path: 'contas-pagar/save',
        component: ContasPagarCrudComponent,
    },
    {
        path: 'contas-pagar/save/:id',
        component: ContasPagarCrudComponent,
    },
]

@NgModule({
    imports: [
        RouterModule.forChild(ROUTES),
        MatButtonModule,
        MatRippleModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
        MatTableModule,
        MatPaginatorModule,
        MatCheckboxModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CurrencyMaskModule,

    ],

    declarations: [
        ClienteGridComponent,
        ClienteCrudComponent,
        FornecedorGridComponent,
        FornecedorCrudComponent,
        UsuarioGridComponent,
        UsuarioCrudComponent,
        ContasReceberGridComponent,
        ContasReceberCrudComponent,
        ContasPagarGridComponent,
        ContasPagarCrudComponent,
        BaixaFinanceiroFormComponent,

    ],

    exports: [
        ClienteGridComponent,
        ClienteCrudComponent,
        FornecedorGridComponent,
        FornecedorCrudComponent,
        UsuarioGridComponent,
        UsuarioCrudComponent,
        ContasReceberGridComponent,
        ContasReceberCrudComponent,
        ContasPagarGridComponent,
        ContasPagarCrudComponent,
        BaixaFinanceiroFormComponent,

        MatIconModule,
    ],
})
export class CadastrosModule {
}
