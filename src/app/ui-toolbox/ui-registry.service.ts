import { Injectable, Type } from '@angular/core';
import { LoggerService } from '../shared/index';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';

@Injectable()
export class UiRegistryService {
    private registry: { [key: string]: Type<any> } = {};

    /**
     * Registry service for UI components
     * components are registered here so we can reuse them as per needed
     */
    constructor(private loggerService: LoggerService) {
        this.loggerService.info('UI toolbox registry initialized');
        this.initializeRegistry();
    }

    getComponentType(key: string): Type<any> {
        return this.registry[key];
    }

    private initializeRegistry() {
        this.registry['bar-chart'] = BarChartComponent;
        this.registry['line-chart'] = LineChartComponent;
    }
}

export const UI_COMPONENTS: any[] = [
    BarChartComponent
];
