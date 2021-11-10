import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LOCALE_ID, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';


import {AppRoutingModule} from './app.routing';
import {ComponentsModule} from './components/components.module';

import {AppComponent} from './app.component';

import {DashboardComponent} from './dashboard/dashboard.component';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {TableListComponent} from './table-list/table-list.component';
import {TypographyComponent} from './typography/typography.component';
import {IconsComponent} from './icons/icons.component';
import {MapsComponent} from './maps/maps.component';
import {NotificationsComponent} from './notifications/notifications.component';
import {UpgradeComponent} from './upgrade/upgrade.component';
import {
    AgmCoreModule
} from '@agm/core';
import {AdminLayoutComponent} from './layouts/admin-layout/admin-layout.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {AuthGuard} from './login/auth-guard';
import {AuthService} from './login/auth-service';
import {LoginComponent} from './login/login.component';
import {registerLocaleData} from '@angular/common';
import localePt from '@angular/common/locales/pt';
import {MatIconModule} from '@angular/material/icon';

registerLocaleData(localePt, 'pt');

@NgModule({
    imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        ComponentsModule,
        RouterModule,
        AppRoutingModule,
        AgmCoreModule.forRoot({
            apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
        }),
        NgxSpinnerModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
    ],
    exports: [
        // MatToolbarModule,
        // MatCardModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatCardModule,
    ],

    declarations: [
        AppComponent,
        AdminLayoutComponent,
        LoginComponent,

    ],

    providers: [
        AuthGuard,
        AuthService,
        {
            provide: LOCALE_ID,
            useValue: 'pt'
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
