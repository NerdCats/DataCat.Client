import { Type, Component, Input, AfterContentInit, ViewChild, ComponentFactoryResolver, OnChanges, SimpleChanges } from '@angular/core';
import { UiHostDirective } from '../ui-host/ui-host.directive';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { Widget } from './widget';
import { UiRegistryService, UI_COMPONENTS } from '../ui-registry.service';
import { LineChartComponent } from '../line-chart/line-chart.component';

@Component({
    selector: 'as-widget',
    entryComponents: [BarChartComponent, LineChartComponent],
    template: ` <template asUiHost></template>`
})
export class WidgetComponent implements AfterContentInit, OnChanges {
    // This should be the widget configuration
    @Input('config') config: any;

    @ViewChild(UiHostDirective) uiHost: UiHostDirective;

    private currentComponent: Widget;

    /**
     * The widget component to host dynamic components
     */
    constructor(
        private uiRegistryService: UiRegistryService,
        private _componentFactoryResolver: ComponentFactoryResolver) { }

    ngAfterContentInit(): void {
        this.loadComponent();
    }

    loadComponent() {
        if (this.config) {
            let componentType = this.uiRegistryService.getComponentType(this.config.type);
            let componentFactory = this._componentFactoryResolver.resolveComponentFactory(componentType);
            let viewContainerRef = this.uiHost.viewContainerRef;
            viewContainerRef.clear();

            let componentRef = viewContainerRef.createComponent(componentFactory);
            let component: Widget = <Widget>componentRef.instance;
            component.setWidgetConfig(this.config);
            this.currentComponent = component;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.currentComponent && changes.config) {
            this.currentComponent.setWidgetConfig(changes.config.currentValue);
        }
    }
}
