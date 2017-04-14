import { DashboardWidget } from './dashboard-widget';

export interface DashboardConfig {
    id: string;
    title: string;
    widgets: DashboardWidget[];
    user: string;
}
