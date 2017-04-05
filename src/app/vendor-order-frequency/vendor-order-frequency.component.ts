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
    public data: any[];

    public sellerItems: Array<any> = [];
    public sellerItemsTemp: Array<any> = [];

    public filterQuery = '';

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
                    if (result) {
                        this.data = result;
                    }
                },
                error => { this.loggerService.error(error); });
        }
    }

    public selected(value: any): void {
        this.value = value;
    }
}
