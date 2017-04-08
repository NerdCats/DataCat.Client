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
    options: any;
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
            if (!this.options && widgetConfig.config) {
                this.options = widgetConfig.config;
            }

            let datamap = widgetConfig.datamap;

            this.dataService.executeAggregation(widgetConfig.connectionId, widgetConfig.collectionName, widgetConfig.query)
                .subscribe(result => {
                    let barChartLabels: string[] = [];
                    let barChartData: any[];
                    let jobCountArray: any[] = [];

                    if (result) {
                        let res: any[] = result;

                        // Currently we only support a single dataset
                        jobCountArray = jsonpath.query(res, datamap.datasets[0].path);
                        barChartLabels = jsonpath.query(res, datamap.labels.path);
                        if (datamap.labels.type) {
                            barChartLabels = barChartLabels.map(x => this.dataConverterService.convert(x, datamap.labels.type));
                        }
                    }

                    barChartData = [{ data: jobCountArray, label: datamap.datasets[0].label }];
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
