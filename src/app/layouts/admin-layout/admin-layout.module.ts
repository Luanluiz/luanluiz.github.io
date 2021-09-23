import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AdminLayoutRoutes} from './admin-layout.routing';
import {DashboardComponent} from '../../dashboard/dashboard.component';
import {UserProfileComponent} from '../../user-profile/user-profile.component';
import {TableListComponent} from '../../table-list/table-list.component';
import {TypographyComponent} from '../../typography/typography.component';
import {IconsComponent} from '../../icons/icons.component';
import {MapsComponent} from '../../maps/maps.component';
import {NotificationsComponent} from '../../notifications/notifications.component';
import {UpgradeComponent} from '../../upgrade/upgrade.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {ClienteGridComponent} from '../../cadastros/clientes/cliente.grid.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {ClienteCrudComponent} from '../../cadastros/clientes/cliente.crud.component';
import {NavbarComponent} from '../../components/navbar/navbar.component';
import {LoginComponent} from '../../login/login.component';
import {MatCardModule} from '@angular/material/card';
import {AuthGuard} from '../../login/auth-guard';
import {ChartsModule} from 'ng2-charts';

export const routes: Routes = [
    {

        path: '',
        canActivate: [AuthGuard],
        children: [
            {
                path: 'cadastros',
                loadChildren: () =>
                    import('../../cadastros/cadastros.module').then(m => m.CadastrosModule),
                // canActivate: [AuthGuard],
            },
            {path: 'dashboard', component: DashboardComponent},
            {path: 'table-list', component: TableListComponent},
            {path: 'typography', component: TypographyComponent},
            {path: 'icons', component: IconsComponent},
            {path: 'user-profile', component: UserProfileComponent},
            {path: 'notifications', component: NotificationsComponent},
            {path: 'upgrade', component: UpgradeComponent},
        ]
    },


    // { path: 'login', component: LoginComponent, data: { reuse: false },  },

];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatRippleModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
        MatTableModule,
        MatPaginatorModule,
        // MatCardModule,
        ChartsModule,
    ],

    declarations: [
        DashboardComponent,
        UserProfileComponent,
        TableListComponent,
        TypographyComponent,
        IconsComponent,
        MapsComponent,
        NotificationsComponent,
        UpgradeComponent,

    ]
})
export class AdminLayoutModule {
}
