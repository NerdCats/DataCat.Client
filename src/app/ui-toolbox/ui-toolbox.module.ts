import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/primeng';
import { BarChartComponent } from './bar-chart/bar-chart.component';

@NgModule({
    declarations: [
        BarChartComponent
    ],
    imports: [
        CommonModule,
        ChartModule
    ],
    exports: [
        BarChartComponent
    ]
})
export class UiToolboxModule { }
