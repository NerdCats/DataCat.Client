import { Component, OnInit } from '@angular/core';
import { DashboardService, DashboardConfig, Feed } from '../data/index';

@Component({
    moduleId: module.id,
    selector: 'as-browse-dashboard',
    templateUrl: 'browse-dashboard.html'
})
export class BrowseDashboardComponent implements OnInit {
    dashboardList: DashboardConfig[];

    /**
     * Component to browse dashboards for an user
     */
    constructor(private dataService: DashboardService) { }

    ngOnInit(): void {
        this.dataService.getDashboardList()
            .subscribe(dashboardFeed => {
                this.dashboardList = dashboardFeed.data;
            });
    }
}
