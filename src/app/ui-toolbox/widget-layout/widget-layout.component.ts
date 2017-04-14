import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data/index';
import { WidgetConfig } from '../widget/widget-config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/mergeAll';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/map';
import { LoggerService } from '../../shared/index';

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
        private dataService: DataService,
        private loggerService: LoggerService) { }

    ngOnInit(): void {
        let sampleDashboardConfig = this.dataService
            .getSampleDashboard()
            .concatMap(dash => Observable.from(dash.widgets))
            .concatMap(widget => this.dataService.getWidgetConfig(widget.widgetId))
            .subscribe(x => console.log(x));

        this.dataService.getWidgetConfig('')
            .subscribe(result => {
                this.config = result;
                // this.widgets = sampleDashboardConfig.widgets;
            }, error => {
                this.loggerService.error(error);
            });
    }
}
