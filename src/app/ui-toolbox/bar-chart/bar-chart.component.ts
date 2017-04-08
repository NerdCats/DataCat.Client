import { Component, Input, ViewChild } from '@angular/core';
import { Widget } from '../../ui-toolbox/widget/widget';
import { UIChart } from 'primeng/primeng';
import * as jsonpath from 'jsonpath';

import { DataConverterService } from '../data-converter.service';
import { DataService } from '../../data/index';
import { LoggerService } from '../../shared/index';

@Component({
    moduleId: module.id,
    selector: 'as-bar-chart',
    templateUrl: 'bar-chart.html'
})
export class BarChartComponent implements Widget {
    config: any;
    data: any;

    isDataAvailable: boolean = false;

    @ViewChild('chart') chart: any;

    /**
     * Basic bar-chart widget constructor
     */
    constructor(
        private dataService: DataService,
        private dataConverterService: DataConverterService,
        private loggerService: LoggerService) { }

    setWidgetConfig(widgetConfig: any) {
        if (widgetConfig) {
            this.dataService.executeAggregation(widgetConfig.connectionId, widgetConfig.collectionName, widgetConfig.query)
                .subscribe(result => {
                    let barChartLabels: string[] = [];
                    let barChartData: any[];
                    let jobCountArray: any[] = [];

                    if (result) {
                        let res: any[] = result;
                        jobCountArray = jsonpath.query(res, '$[*].count');
                        barChartLabels = jsonpath.query(res, '$[*]._id.CreateDate[\'$date\']');
                        barChartLabels = barChartLabels.map(x => this.dataConverterService.convert(x, 'datestring'));
                    }

                    barChartData = [{ data: jobCountArray, label: 'Orders' }];
                    this.data = { labels: barChartLabels, datasets: barChartData };
                    this.isDataAvailable = true;
                }, error => {
                    this.loggerService.error(error);
                });
        }
    }

    private _refreshChart() {
        if (this.chart) {
            this.chart.refresh();
        }
    }
}
