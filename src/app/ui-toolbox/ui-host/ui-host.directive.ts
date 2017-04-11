import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[asUiHost]'
})
export class UiHostDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}
