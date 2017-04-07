import { Component, Input, ViewChild } from '@angular/core';
import { Widget } from '../../ui-toolbox/widget/widget';
import { UIChart } from 'primeng/primeng';

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

    setData(data: any) {
        this.data = data;
        this.isDataAvailable = true;
    }

    setConfig(config: any) {
        this.config = config;
    }

    private _refreshChart() {
        if (this.chart) {
            this.chart.refresh();
        }
    }
}
