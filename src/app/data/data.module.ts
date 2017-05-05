import { NgModule } from '@angular/core';
import { DataService } from './data.service';
import { DashboardService } from './dashboard.service';
import { DATA_PROVIDERS } from './data.providers';

@NgModule({
    providers: [
        ...DATA_PROVIDERS
    ]
})
export class DataModule { }
