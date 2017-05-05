import { Component, OnInit } from '@angular/core';
import { DataService, DashboardWidget, DashboardService } from '../../data/index';
import { WidgetConfig } from '../widget/widget-config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/concatMap';
import { LoggerService } from '../../shared/index';
import { DashboardEventService } from '../../dashboard/index';
import { ActivatedRoute } from '@angular/router';

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
        private route: ActivatedRoute,
        private dataService: DataService,
        private dashboardService: DashboardService,
        private loggerService: LoggerService,
        private dashboardEventService: DashboardEventService) { }

    ngOnInit(): void {
        let id = this.route.snapshot.paramMap.get('id');
        this.widgets = [];

        this.dashboardService
            .getDashboard(id)
            .concatMap(dash => {
                this._setDashboardTitle(dash.title);
                return Observable.from(dash.widgets);
            })
            .concatMap(widget => this.dataService.getWidgetConfig(widget.widgetId), (dashw, widget) => {
                return {
                    windowConf: dashw,
                    widgetConf: widget
                };
            })
            .subscribe(dwidget => this.widgets.push(dwidget));
    }

    private _setDashboardTitle(title: string) {
        this.dashboardEventService.componentUpdated({ Event: 'Loaded', Name: title });
    }
}
