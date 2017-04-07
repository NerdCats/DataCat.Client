import { Component, OnInit, ViewChild } from '@angular/core';
import { BarChartComponent, WidgetComponent } from '../index';
import { DataService } from '../../data/index';

@Component({
    moduleId: module.id,
    selector: 'as-widget-layout',
    templateUrl: 'widget-layout.html'
})
export class WidgetLayoutComponent implements OnInit {
    componentType = BarChartComponent;
    data: any;

    constructor(private dataService: DataService) { }

    ngOnInit(): void {
        let sampleWidget = this.dataService.getSampleWidget();

        this.dataService.executeAggregation(sampleWidget.connectionId, sampleWidget.collectionName, sampleWidget.query)
            .subscribe(result => {
                let barChartLabels: string[] = [];
                let barChartData: any[];

                let jobCountArray: any[] = [];
                if (result) {
                    // Need to parse this crap here
                    let res: any[] = result;
                    for (let entry of res) {
                        barChartLabels.push(new Date(entry._id.CreateDate.$date).toDateString());
                        jobCountArray.push(entry.count);
                    }
                }
                barChartData = [{ data: jobCountArray, label: 'Orders' }];
                this.data = { labels: barChartLabels, datasets: barChartData };
            },
            error => { console.log('error'); });
    }
}