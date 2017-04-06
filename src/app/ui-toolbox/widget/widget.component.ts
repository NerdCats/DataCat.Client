import { Type, Component, Input, AfterViewInit, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { UiHostDirective } from '../ui-host/ui-host.directive';

export interface IWidgetComponent {
    data: any;
    config: any;
}

@Component({
    selector: 'as-widget',
    template: ` <template asUiHost></template>`
})
export class WidgetComponent implements AfterViewInit {
    @Input() componentType: Type<any>;
    @Input() data: any;
    @Input() config: any;
    @ViewChild(UiHostDirective) uiHost: UiHostDirective;

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
        component.data = this.data;
        component.config = this.config;
    }
}
