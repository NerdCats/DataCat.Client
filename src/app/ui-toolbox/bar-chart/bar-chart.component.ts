import { Component, Input, ViewChild } from '@angular/core';
import { UIChart } from 'primeng/primeng';
import * as jsonpath from 'jsonpath';

import { Widget } from '../../ui-toolbox/widget/widget';
import { WidgetConfig } from '../../ui-toolbox/widget/widget-config';
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
    title: any;

    isDataAvailable: boolean;

    @ViewChild('chart') chart: any;

    /**
     * Basic bar-chart widget constructor
     */
    constructor(
        private dataService: DataService,
        private dataConverterService: DataConverterService,
        private loggerService: LoggerService) { }

    setWidgetConfig(widgetConfig: WidgetConfig) {
        if (widgetConfig) {
            this.dataService.executeAggregation(
                widgetConfig.connectionId,
                widgetConfig.collectionName,
                JSON.parse(widgetConfig.filter.filterString))
                .subscribe(result => {
                    this._show(widgetConfig, result);
                }, error => {
                    this.loggerService.error(error);
                });
        }
    }

    private _show(widgetConfig: WidgetConfig, result: any) {
        let datamap = widgetConfig.dataMap;

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
                let dataset: any = { data: jobCountArray, label: datamap.datasets[i].label };

                if (datamap.datasets[i].backgroundColor) {
                    dataset.backgroundColor = datamap.datasets[i].backgroundColor;
                }

                if (datamap.datasets[i].borderColor) {
                    dataset.borderColor = datamap.datasets[i].borderColor;
                }

                barChartDataArray.push(dataset);
            }
        }

        barChartData = barChartDataArray;
        this.data = { labels: barChartLabels, datasets: barChartData };
        this._setOptions(widgetConfig);
        this.isDataAvailable = true;
    }

    private _setOptions(widgetConfig: WidgetConfig) {
        console.log(widgetConfig);
        if (widgetConfig.config) {
            this.title = widgetConfig.config.title.text;
            this.options = { ...widgetConfig.config };
        }
    }

    private _refreshChart() {
        if (this.chart) {
            this.chart.refresh();
        }
    }
}
