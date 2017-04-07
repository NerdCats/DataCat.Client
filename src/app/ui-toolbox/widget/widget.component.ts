import { Type, Component, Input, AfterViewInit, ViewChild, ComponentFactoryResolver, OnChanges, SimpleChanges } from '@angular/core';
import { UiHostDirective } from '../ui-host/ui-host.directive';
import { BarChartComponent } from '../bar-chart/bar-chart.component';

export interface IWidgetComponent {
    data: any;
    config: any;
    setData(data: any);
}

@Component({
    selector: 'as-widget',
    entryComponents: [BarChartComponent],
    template: ` <template asUiHost></template>`
})
export class WidgetComponent implements AfterViewInit, OnChanges {
    @Input() componentType: Type<any>;
    @Input('data') data: any;
    @Input() config: any;
    @ViewChild(UiHostDirective) uiHost: UiHostDirective;

    private currentComponent: IWidgetComponent;

    /**
     * The widget component to host dynamic components
     */
    constructor(private _componentFactoryResolver: ComponentFactoryResolver) { }

    ngAfterViewInit(): void {
        this.loadComponent();
    }

    loadComponent() {
        let componentFactory = this._componentFactoryResolver.resolveComponentFactory(this.componentType);
        let viewContainerRef = this.uiHost.viewContainerRef;
        viewContainerRef.clear();

        let componentRef = viewContainerRef.createComponent(componentFactory);
        let component: IWidgetComponent = <IWidgetComponent>componentRef.instance;
        // component.data = this.data;
        component.config = this.config;
        this.currentComponent = component;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.currentComponent && changes.data) {
            this.currentComponent.setData(changes.data.currentValue);
        }
    }
}