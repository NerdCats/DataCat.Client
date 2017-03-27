import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { DataTableModule } from 'angular2-datatable';
import { APP_PROVIDERS } from './app.providers';
import { AppComponent } from './app.component';
import { appRoutingProviders, routing } from './app.routing';
import { LoginModule } from './login/login.module';
import { DashboardModule } from './dashboard/dashboard.module';
@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        HttpModule,
        DashboardModule,
        LoginModule,
        routing,
        DataTableModule
    ],
    providers: [APP_PROVIDERS, appRoutingProviders],
    bootstrap: [AppComponent]
})
export class AppModule { }
