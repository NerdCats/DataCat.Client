import { Component, Input, ViewChild } from '@angular/core';
import { IWidgetComponent } from '../../ui-toolbox/widget/widget.component';
import { UIChart } from 'primeng/primeng';

@Component({
    moduleId: module.id,
    selector: 'as-bar-chart',
    templateUrl: 'bar-chart.html'
})
export class BarChartComponent implements IWidgetComponent {
    config: any;
    data: any;

    isDataAvailable: boolean = false;

    @ViewChild('chart') chart: any;

    setData(data: any) {
        this.data = data;
        this.isDataAvailable = true;

        if (this.chart) {
            this.chart.refresh();
        }
    }
}
