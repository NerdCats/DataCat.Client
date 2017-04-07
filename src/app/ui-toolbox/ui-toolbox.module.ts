import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/primeng';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { WidgetComponent } from './widget/widget.component';
import { UiHostDirective } from './ui-host/ui-host.directive';
import { WidgetLayoutComponent } from './widget-layout/widget-layout.component';

@NgModule({
    declarations: [
        BarChartComponent,
        WidgetComponent,
        UiHostDirective,
        WidgetLayoutComponent
    ],
    imports: [
        CommonModule,
        ChartModule
    ],
    exports: [
        BarChartComponent,
        WidgetLayoutComponent,
        UiHostDirective,
        WidgetComponent
    ]
})
export class UiToolboxModule { }
