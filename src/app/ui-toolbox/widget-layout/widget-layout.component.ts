import { Component } from '@angular/core';
import { BarChartComponent } from '../index';

@Component({
    moduleId: module.id,
    selector: 'as-widget-layout',
    templateUrl: 'widget-layout.html'
})
export class WidgetLayoutComponent {
    componentType = BarChartComponent;
}
