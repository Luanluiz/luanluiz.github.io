import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LOCALE_ID, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';


import {AppRoutingModule} from './app.routing';
import {ComponentsModule} from './components/components.module';

import {AppComponent} from './app.component';

import {
    AgmCoreModule
} from '@agm/core';
import {AdminLayoutComponent} from './layouts/admin-layout/admin-layout.component';
import {NgxSpinnerModule} from 'ngx-spinner';
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
        MatInputModule,
        MatButtonModule
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
