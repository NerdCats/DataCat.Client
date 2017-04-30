﻿import { Component, OnInit } from '@angular/core';
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

    // date range
    public selectedFromDate: any;
    public selectedToDate: any;

    // attempt VS delivery doc
    public AttemptVsDeliveryDoc: any = { // this is initialization doc so that UI shows data on init
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

    // vendor names
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

    // holds the selected vendor
    public selectedVendorValue: any = {};

    constructor(
        private dataService: DataService,
        private loggerService: LoggerService,
        private dashboarEventService: DashboardEventService) {
        dashboarEventService.componentUpdated({ Event: 'loaded', Name: 'Attempt VS Delivery' });
    }

    ngOnInit() {
        this.dataService.executeAggregation('Jobs', this.SellerNamesDoc)// get the vendors
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

        this.dataService.executeAggregation('Jobs', this.AttemptVsDeliveryDoc) // get attempt vs delivery for all vendors for all times
            .subscribe(result => {
                if (result) {
                    for (let entry of result) {
                        let AvgTimeToDelivery: number = entry.AvgTimeToDelivery as number;
                        entry.AvgTimeToDelivery = AvgTimeToDelivery;
                    }
                    this.data = result;
                }
            },
            error => { this.loggerService.error(error); });
    }

    // slected vendor
    public selected(value: any): void {
        this.selectedVendorValue = value;
        if (value != null) {
            this.AttemptVsDeliveryDoc = this.prepareAttemptVsDeliveryDoc(this.AttemptVsDeliveryDoc); // get data for selected vendor
            this.dataService.executeAggregation('Jobs', this.AttemptVsDeliveryDoc)
                .subscribe(result => {
                    if (result) {
                        for (let entry of result) {
                            let AvgTimeToDelivery: number = entry.AvgTimeToDelivery as number;
                            entry.AvgTimeToDelivery = AvgTimeToDelivery;
                        }
                        this.data = result;
                    }
                },
                error => { this.loggerService.error(error); });
        }

    }

    // query: Attempt Vs Delivery
    public prepareAttemptVsDeliveryDoc(value: any): any {
        try {
            if (this.selectedVendorValue != null) {// vendor selected
                if (this.selectedFromDate == null || this.selectedToDate == null) {
                    return value = {
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
                                    'Seller': this.selectedVendorValue.id as string
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
                } else {
                    return value = {
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
                                    'Seller': this.selectedVendorValue.id as string
                                }
                            },
                            {
                                $match: {
                                    'AttemptCount': { $gte: 1 },
                                    'State': 'COMPLETED',
                                    'Tasks.IsTerminatingTask': true,
                                    'Tasks.State': 'COMPLETED',
                                    'Tasks.Type': 'Delivery',
                                    'CreateTime':
                                    {
                                        $gte: { '$date': (this.selectedFromDate as Date).toISOString() },
                                        $lt: { '$date': (this.selectedToDate as Date).toISOString() }
                                    },
                                },
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
                }
            } else {// vendor not selected
                if (this.selectedFromDate == null || this.selectedToDate == null) {
                    return value = {
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
                } else {
                    return value = {
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
                                    'CreateTime':
                                    {
                                        $gte: { '$date': (this.selectedFromDate as Date).toISOString() },
                                        $lt: { '$date': (this.selectedToDate as Date).toISOString() }
                                    },
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
                }

            }

        } catch (e) {
            console.log(e);
            return null;
        }
    }
}