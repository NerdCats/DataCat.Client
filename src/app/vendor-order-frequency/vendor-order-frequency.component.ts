import { Component, OnInit } from '@angular/core';
import { DashboardEventService } from '../dashboard/dashboard-event.service';
import { DataService } from '../data/index';
import { LoggerService } from '../shared/index';

@Component({
    moduleId: module.id,
    selector: 'as-vendor-order-frequency',
    templateUrl: 'vendor-order-frequency.html'
})
export class VendorOrderFrequencyComponent implements OnInit {

    // for table
    public data: any[];
    public filterQuery = '';

    // for seller combo
    public sellerItems: Array<any> = [];
    public sellerItemsTemp: Array<any> = [];

    // for aggregation combo
    public aggregateOptions: Array<any> = [{ id: '%Y-%m-%d', text: 'Day' }, { id: '%Y-%m', text: 'Month' }, { id: '%Y', text: 'Year' }];
    public aggregateBy: any = {};

    public VendorOrderFrequencyDoc: any;

    public SellerNamesDoc: any = {
        'aggregate':
        [
            {
                $project: {
                    Seller: '$Order.SellerInfo.Name'
                }
            },
            {
                $group: {
                    _id: '$Seller',
                }
            },
            { $sort: { _id: 1 } }
        ]
    };

    // holds selected seller
    public value: any = {};

    // for bar chart
    // public isDataAvailable: boolean = false;
    // public barChartLabels: string[] = [];
    // public barChartType: string = 'bar';
    // public barChartLegend: boolean = true;
    // public barChartData: any[];
    // public barChartOptions: any = {
    //    scaleShowVerticalLines: false,
    //    responsive: true,
    //    scales: {
    //        yAxes: [{
    //            display: true,
    //            ticks: {
    //                suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
    //                // OR //
    //                beginAtZero: true,   // minimum value will be 0.
    //                suggestedMax: 100,
    //                max: 150
    //            }
    //        }]
    //    }
    // };

    constructor(
        private dataService: DataService,
        private loggerService: LoggerService,
        private dashboarEventService: DashboardEventService) {
        dashboarEventService.componentUpdated({ Event: 'loaded', Name: 'Vendor Order Frequency' });
    }

    ngOnInit() {
        this.dataService.executeAggregation('Jobs', this.SellerNamesDoc)
            .subscribe(result => {
                if (result) {

                    try {
                        let len = result.length;
                        for (let i = 0; i < len; i++) {
                            if (result[i]._id as string != null) {
                                let element = { id: result[i]._id as string, text: result[i]._id as string };
                                this.sellerItemsTemp[i] = element;
                            }
                        }
                        this.sellerItems = this.sellerItemsTemp;
                    } catch (e) {
                        console.log('YO', e);
                    }
                }
            },
            error => { this.loggerService.error(error); });
    }

    // selected item : aggregateBy
    public selectedAggreateBy(value: any): void {
        this.aggregateBy = value;
        if (value != null) {

            this.VendorOrderFrequencyDoc = {
                'aggregate':
                [
                    {
                        $project: {
                            _id: 1, HRID: 1, Name: 1, State: 1, CreateTime: 1,
                            Tasks: { $slice: ['$Tasks', -1] },
                            Seller: '$Order.SellerInfo.Name'
                        }
                    },
                    {
                        $match: {
                            'Tasks.Type': 'Delivery',
                            'Seller': this.value.id as string
                        },
                    },
                    {
                        $group: {
                            _id: { $dateToString: { format: this.aggregateBy.id as string, date: '$CreateTime' } },
                            PlacedOrders: { $sum: 1 },


                        }
                    },
                    { $sort: { _id: 1 } }
                ]
            };
            this.dataService.executeAggregation('Jobs', this.VendorOrderFrequencyDoc)
                .subscribe(result => {
                    // let jobCountArray: any[] = [];
                    // this.barChartLabels = [];
                    // this.barChartData = [];
                    if (result) {
                        // this.isDataAvailable = true;
                        this.data = result;
                        // for (let entry of this.data) {
                        //    this.barChartLabels.push(entry._id as string);
                        //    jobCountArray.push(entry.PlacedOrders);
                        // }
                    }
                    // this.barChartData = [{ data: jobCountArray, label: 'Orders' }];
                },
                error => { this.loggerService.error(error); });
        }
    }

    // selected item : value cum seller
    public selected(value: any): void {
        this.value = value;
    }
}
