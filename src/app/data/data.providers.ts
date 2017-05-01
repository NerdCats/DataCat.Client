import { DataService } from './data.service';
import { DashboardService } from './dashboard.service';

export const DATA_PROVIDERS: any[] = [
    { provide: DataService, useClass: DataService },
    { provide: DashboardService, useClass: DashboardService }
];
