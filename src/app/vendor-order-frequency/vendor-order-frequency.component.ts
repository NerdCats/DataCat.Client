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

    // for holding query
    public VendorOrderFrequencyDoc: any;

    public SellerNamesDoc: any = {
        'aggregate':
        [
            {
                $project: {
                    Seller: '$User.UserName', Type: '$User.Type'
                }
            },
            {
                $match: {
                    'Type': 'ENTERPRISE',
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

    // date range
    public selectedFromDate: any;
    public selectedToDate: any;

    // constructor
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

            this.VendorOrderFrequencyDoc = this.prepareVendorOrderFrequencyDoc(this.VendorOrderFrequencyDoc);
            this.dataService.executeAggregation('Jobs', this.VendorOrderFrequencyDoc)
                .subscribe(result => {
                    if (result) {
                        this.data = result;
                    }
                },
                error => { this.loggerService.error(error); });
        }
    }

    // query: order frequency
    public prepareVendorOrderFrequencyDoc(value: any): any {
        try {

            if (this.selectedFromDate == null || this.selectedToDate == null) {
                return value = {
                    'aggregate':
                    [
                        {
                            $project: {
                                _id: 1, HRID: 1, Name: 1, State: 1, CreateTime: 1,
                                Tasks: { $slice: ['$Tasks', -1] },
                                Seller: '$User.UserName'
                            }
                        },
                        {
                            $match: {
                                'Tasks.Type': 'Delivery',
                                'Seller': this.value.id as string,
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
            } else {
                return value = {
                    'aggregate':
                    [
                        {
                            $project: {
                                _id: 1, HRID: 1, Name: 1, State: 1, CreateTime: 1,
                                Tasks: { $slice: ['$Tasks', -1] },
                                Seller: '$User.UserName'
                            }
                        },
                        {
                            $match: {
                                'Tasks.Type': 'Delivery',
                                'Seller': this.value.id as string,
                                'CreateTime':
                                {
                                    $gte: { '$date': (this.selectedFromDate as Date).toISOString() },
                                    $lt: { '$date': (this.selectedToDate as Date).toISOString() }
                                },
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
            }
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    // selected item : value cum seller
    public selected(value: any): void {
        this.value = value;
        if (value != null && this.aggregateBy != null) {

            this.VendorOrderFrequencyDoc = this.prepareVendorOrderFrequencyDoc(this.VendorOrderFrequencyDoc);
            this.dataService.executeAggregation('Jobs', this.VendorOrderFrequencyDoc)
                .subscribe(result => {
                    if (result) {
                        this.data = result;
                    }
                },
                error => { this.loggerService.error(error); });
        }
    }
}
