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
                    let barChartDataArray: any[] = [];

                    if (result) {
                        let res: any[] = result;

                        barChartLabels = jsonpath.query(res, datamap.labels.path);
                        if (datamap.labels.type) {
                            barChartLabels = barChartLabels.map(x => this.dataConverterService.convert(x, datamap.labels.type));
                        }

                        for (let i = 0; i < datamap.datasets.length; i++) {
                            let jobCountArray = jsonpath.query(res, datamap.datasets[i].path);
                            barChartDataArray.push({ data: jobCountArray, label: datamap.datasets[i].label });
                        }
                    }

                    barChartData = barChartDataArray;
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
