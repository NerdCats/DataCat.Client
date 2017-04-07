import { Component, Input } from '@angular/core';
import { IWidgetComponent } from '../../ui-toolbox/widget/widget.component';

@Component({
    moduleId: module.id,
    selector: 'as-bar-chart',
    templateUrl: 'bar-chart.html'
})
export class BarChartComponent implements IWidgetComponent {
    config: any;
    data: any;

    constructor() {
        this.data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };
    }
}
