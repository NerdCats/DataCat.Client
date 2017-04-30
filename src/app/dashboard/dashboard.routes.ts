import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { GlimpseComponent } from '../glimpse/index';
import { AttemptVsDeliveryComponent } from '../attempt-vs-delivery/index';
import { VendorOrderFrequencyComponent } from '../vendor-order-frequency/index';
import { PeriodicOrderFrequencyComponent } from '../periodic-order-frequency/index';

export const DashboardRoutes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
            // { path: '', redirectTo: 'attempt-vs-delivery', pathMatch: 'full' },
            { path: 'glimpse', component: GlimpseComponent },
            { path: 'attempt-vs-delivery', component: AttemptVsDeliveryComponent },
            { path: 'vendor-order-frequency', component: VendorOrderFrequencyComponent },
            { path: 'periodic-order-frequency', component: PeriodicOrderFrequencyComponent }
        ]
    }
];
