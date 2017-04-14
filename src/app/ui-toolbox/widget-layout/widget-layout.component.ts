import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data/index';
import { WidgetConfig } from '../widget/widget-config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/concatMap';
import { LoggerService } from '../../shared/index';
import { DashboardWidget } from '../dashboard/dashboard-widget';

@Component({
    moduleId: module.id,
    selector: 'as-widget-layout',
    templateUrl: 'widget-layout.html'
})
export class WidgetLayoutComponent implements OnInit {
    public config: any;

    public widgets: { windowConf: DashboardWidget, widgetConf: WidgetConfig }[];

    /**
     * misnomer, it should be what a traditional single dashboard looks like
     */
    constructor(
        private dataService: DataService,
        private loggerService: LoggerService) { }

    ngOnInit(): void {
        this.widgets = [];

        let sampleDashboardConfig = this.dataService
            .getSampleDashboard()
            .concatMap(dash => Observable.from(dash.widgets))
            .concatMap(widget => this.dataService.getWidgetConfig(widget.widgetId), (dashw, widget) => {
                return {
                    windowConf: dashw,
                    widgetConf: widget
                };
            })
            .subscribe(dwidget => this.widgets.push(dwidget));

        this.dataService.getWidgetConfig('')
            .subscribe(result => {
                this.config = result;
                // this.widgets = sampleDashboardConfig.widgets;
            }, error => {
                this.loggerService.error(error);
            });
    }
}
