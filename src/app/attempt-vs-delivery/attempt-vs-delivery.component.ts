import { Component, OnInit } from '@angular/core';
import { DashboardEventService } from '../dashboard/dashboard-event.service';
import { DataService } from '../data/index';
import { LoggerService } from '../shared/index';

@Component({
    moduleId: module.id,
    selector: 'as-attempt-vs-delivery',
    templateUrl: 'attempt-vs-delivery.html'
})
export class AttemptVsDeliveryComponent implements OnInit {
    public data: any[];
    public sellerItems: Array<any> = [];
    public sellerItemsTemp: Array<any> = [];
    public filterQuery = '';
    public rowsOnPage = 10;
    public sortBy = '_id';
    public sortOrder = 'asc';

    public AttemptVsDeliveryDoc: any = {
        'aggregate':
        [
            {
                $project: {
                    _id: 1, HRID: 1, Name: 1, State: 1, CreateTime: 1, ModifiedTime: 1, CompletionTime: 1, AttemptCount: 1,
                    Tasks: { $slice: ['$Tasks', -1] },
                    Seller: '$User.UserName'
                }
            },
            {
                $match: {
                    'AttemptCount': { $gte: 1 },
                    'State': 'COMPLETED',
                    'Tasks.IsTerminatingTask': true,
                    'Tasks.State': 'COMPLETED',
                    'Tasks.Type': 'Delivery',
                }
            },
            {
                $group: {
                    _id: '$AttemptCount',
                    DeliveredOrders: { $sum: 1 },
                    AvgTimeToDelivery: { $avg: { $divide: [{ $subtract: ['$CompletionTime', '$CreateTime'] }, 86400000] } }
                }
            },
            { $sort: { _id: 1 } }
        ]
    };

    public SellerNamesDoc: any = {
        'find':
        [
            { Type: 'ENTERPRISE' }, { 'UserName': 1, _id: false }
        ]
    };

    private value: any = {};
    constructor(
        private dataService: DataService,
        private loggerService: LoggerService,
        private dashboarEventService: DashboardEventService) {
        dashboarEventService.componentUpdated({ Event: 'loaded', Name: 'Attempt VS Delivery' });
    }

    ngOnInit() {
        this.dataService.executeQuery('Users', this.SellerNamesDoc)
            .subscribe(result => {
                if (result) {

                    try {
                        let len = result.length;
                        for (let i = 0; i < len; i++) {
                            if (result[i].UserName as string != null) {
                                let element = { id: result[i].UserName as string, text: result[i].UserName as string };
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

        this.dataService.executeAggregation('Jobs', this.AttemptVsDeliveryDoc)
            .subscribe(result => {
                if (result) {
                    for (let entry of result) {
                        let AvgTimeToDelivery: number = Math.round(entry.AvgTimeToDelivery as number);
                        entry.AvgTimeToDelivery = AvgTimeToDelivery;
                    }
                    this.data = result;
                }
            },
            error => { this.loggerService.error(error); });
    }

    public selected(value: any): void {
        this.value = value;
        if (value != null) {

            this.AttemptVsDeliveryDoc = {
                'aggregate':
                [
                    {
                        $project: {
                            _id: 1, HRID: 1, Name: 1, State: 1, CreateTime: 1, ModifiedTime: 1, CompletionTime: 1, AttemptCount: 1,
                            Tasks: { $slice: ['$Tasks', -1] },
                            Seller: '$User.UserName'
                        }
                    },
                    {
                        $match: {
                            'AttemptCount': { $gte: 1 },
                            'State': 'COMPLETED',

                            'Tasks.IsTerminatingTask': true,
                            'Tasks.State': 'COMPLETED',
                            'Tasks.Type': 'Delivery',
                            'Seller': this.value.id as string
                        }
                    },
                    {
                        $group: {
                            _id: '$AttemptCount',
                            DeliveredOrders: { $sum: 1 },
                            AvgTimeToDelivery: { $avg: { $divide: [{ $subtract: ['$CompletionTime', '$CreateTime'] }, 86400000] } }
                        }
                    },
                    { $sort: { _id: 1 } }
                ]
            };
            this.dataService.executeAggregation('Jobs', this.AttemptVsDeliveryDoc)
                .subscribe(result => {
                    if (result) {
                        for (let entry of result) {
                            let AvgTimeToDelivery: number = Math.round(entry.AvgTimeToDelivery as number);
                            entry.AvgTimeToDelivery = AvgTimeToDelivery;
                        }
                        this.data = result;
                    }
                },
                error => { this.loggerService.error(error); });
        }

    }
}
