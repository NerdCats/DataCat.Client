import { Component, OnInit, ViewChild, Type } from '@angular/core';
import { BarChartComponent, WidgetComponent } from '../index';
import { DataService } from '../../data/index';
import { UiRegistryService } from '../ui-registry.service';
import * as jsonpath from 'jsonpath';
import { DataConverterService } from '../data-converter.service';

@Component({
    moduleId: module.id,
    selector: 'as-widget-layout',
    templateUrl: 'widget-layout.html'
})
export class WidgetLayoutComponent implements OnInit {
    componentType: Type<any>;
    data: any;

    constructor(
        private dataService: DataService,
        private uiRegistryService: UiRegistryService,
        private dataConverterService: DataConverterService) { }

    ngOnInit(): void {
        let sampleWidget = this.dataService.getSampleWidgetConfig();
        this.componentType = this.uiRegistryService.getComponentType(sampleWidget.type);

        this.dataService.executeAggregation(sampleWidget.connectionId, sampleWidget.collectionName, sampleWidget.query)
            .subscribe(result => {
                let barChartLabels: string[] = [];
                let barChartData: any[];

                let jobCountArray: any[] = [];
                if (result) {
                    // Need to parse this crap here
                    let res: any[] = result;
                    jobCountArray = jsonpath.query(res, '$[*].count');
                    barChartLabels = jsonpath.query(res, '$[*]._id.CreateDate[\'$date\']');
                    barChartLabels = barChartLabels.map(x => this.dataConverterService.convert(x, 'datestring'));
                    console.log(jobCountArray);
                }
                barChartData = [{ data: jobCountArray, label: 'Orders' }];
                this.data = { labels: barChartLabels, datasets: barChartData };
            },
            error => { console.log('error'); });
    }
}
