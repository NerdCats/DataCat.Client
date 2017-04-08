import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data/index';

@Component({
    moduleId: module.id,
    selector: 'as-widget-layout',
    templateUrl: 'widget-layout.html'
})
export class WidgetLayoutComponent implements OnInit {
    config: any;

    constructor(
        private dataService: DataService) { }

    ngOnInit(): void {
        let sampleWidgetConfig = this.dataService.getSampleWidgetConfig();
        this.config = sampleWidgetConfig;
    }
}
