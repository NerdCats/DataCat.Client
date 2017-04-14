import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/primeng';

import { BarChartComponent } from './bar-chart/bar-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { WidgetComponent } from './widget/widget.component';
import { UiHostDirective } from './ui-host/ui-host.directive';
import { WidgetLayoutComponent } from './widget-layout/widget-layout.component';

import { UI_TOOLBOX_PROVIDERS } from './ui-toolbox.providers';

@NgModule({
    declarations: [
        BarChartComponent,
        LineChartComponent,
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
        LineChartComponent,
        WidgetLayoutComponent,
        UiHostDirective,
        WidgetComponent
    ],
    providers: [...UI_TOOLBOX_PROVIDERS]
})
export class UiToolboxModule { }
