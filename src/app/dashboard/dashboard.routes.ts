import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { BarChartComponent, WidgetComponent, WidgetLayoutComponent } from '../ui-toolbox/index';

export const DashboardRoutes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
            { path: '', redirectTo: 'widgets', pathMatch: 'full' },
            { path: 'widgets', component: WidgetLayoutComponent }
        ]
    }
];
