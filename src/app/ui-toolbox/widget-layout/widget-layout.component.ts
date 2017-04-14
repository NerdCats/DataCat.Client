import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data/index';
import { WidgetConfig } from '../widget/widget-config';

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
        this.dataService.getSampleWidgetConfig()
            .subscribe(result => {
                this.config = result;
                this.widgets = sampleDashboardConfig.widgets;
            }, error => {
                // TODO: Use loggerService here
                console.error(error);
            });
    }
}
