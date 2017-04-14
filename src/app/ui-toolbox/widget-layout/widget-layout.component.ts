import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data/index';

@Component({
    moduleId: module.id,
    selector: 'as-widget-layout',
    templateUrl: 'widget-layout.html'
})
export class WidgetLayoutComponent implements OnInit {
    public config: any;

    public widgets: any[];

    /**
     * misnomer, it should be what a traditional single dashboard looks like
     */
    constructor(
        private dataService: DataService) { }

    ngOnInit(): void {
        let sampleDashboardConfig = this.dataService.getSampleDashboard();
        let sampleWidgetConfig = this.dataService.getSampleWidgetConfig();
        this.config = sampleWidgetConfig;
        this.widgets = sampleDashboardConfig.widgets;
        console.log(this.widgets);
    }
}
