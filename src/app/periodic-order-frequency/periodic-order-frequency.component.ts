﻿import { forEach } from '@angular/router/src/utils/collection';
import { Component, OnInit } from '@angular/core';
import { DashboardEventService } from '../dashboard/dashboard-event.service';
import { DataService } from '../data/index';
import { LoggerService } from '../shared/index';

@Component({
    moduleId: module.id,
    selector: 'as-periodic-order-frequency',
    templateUrl: 'periodic-order-frequency.html'
})

export class PeriodicOrderFrequencyComponent implements OnInit {

    // for table
    public data: Array<DataSegment> = new Array<DataSegment>();
    public dataTemp: Array<DataSegment> = new Array<DataSegment>();
    public filterQuery = '';
    public dataSegment: DataSegment = new DataSegment();
    public dateCount: DateCount = new DateCount();

    // for vendors
    public vendors: Array<VendorSegment> = new Array<VendorSegment>();
    public vendorsTemp: Array<VendorSegment> = new Array<VendorSegment>();
    public vendorSegment: VendorSegment = new VendorSegment();

    public dates: any[];

    // for aggregation combo
    public aggregateOptions: Array<any> = [{ id: '%Y-%m-%d', text: 'Day' }, { id: '%Y-%m', text: 'Month' }, { id: '%Y', text: 'Year' }];
    public aggregateBy: any = {};

    // for holding query
    public PeriodicOrderFrequencyDoc: any;

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
        this.PeriodicOrderFrequencyDoc = null;
    }

    // selected item : aggregateBy
    public selectedAggreateBy(value: any): void {
        this.aggregateBy = value;
        if (value != null) {

            this.PeriodicOrderFrequencyDoc = this.preparePeriodicOrderFrequencyDoc(this.PeriodicOrderFrequencyDoc);
            this.dataService.executeAggregation('Jobs', this.PeriodicOrderFrequencyDoc)
                .subscribe(result => {
                    try {

                        let len = result.length;
                        for (let i = 0; i < len; i++) {

                            if (!this.vendorsTemp.some(x => x.id === result[i]._id.Vendor as string)) {

                                // get distinct vendor list
                                let vs = new VendorSegment();
                                vs.id = result[i]._id.Vendor as string;
                                this.vendorsTemp.push(vs);
                            }

                            // get distict dates
                            if (!this.dates.some(x => x === result[i]._id.Time as string)) {
                                this.dates.push(result[i]._id.Time as string);
                            }
                        }

                        this.vendors = this.vendorsTemp;
                        let lenVendors = this.vendors.length;
                        let lenDates = this.dates.length;

                        console.log(this.vendors);
                        console.log(this.dates);

                        for (let j = 0; j < lenVendors; j++) {// for each vendors

                            this.dataSegment = new DataSegment();
                            this.dataSegment.Vendor = this.vendors[j].id; // set vendor

                            for (let i = 0; i < len; i++) {// for each record

                                if (result[i]._id.Vendor as string === this.vendors[j].id) { // if for set vendor

                                    for (var z = 0; z < lenDates; z++) {

                                        if (this.dates[z] == result[i]._id.Time) {

                                            this.dateCount = new DateCount();
                                            this.dateCount.count = result[i].PlacedOrders as number;
                                            this.dateCount.date = result[i]._id.Time as string;

                                            this.dataSegment.DateCounts.push(this.dateCount);// append dateCount array
                                        }
                                        else {

                                            this.dateCount = new DateCount();
                                            this.dateCount.count = 0;
                                            this.dateCount.date = this.dates[z] as string;
                                            this.dataSegment.DateCounts.push(this.dateCount);// append dateCount array

                                        }
                                    }

                                }
                            }
                            this.dataTemp.push(this.dataSegment);// finally push it to the list
                        }

                        this.data = this.dataTemp;

                        console.log(this.data);

                    } catch (e) {
                        console.log('YO', e);
                    }

                },
                error => { this.loggerService.error(error); });
        }
    }

    // query: order frequency
    public preparePeriodicOrderFrequencyDoc(value: any): any {
        try {

            if (this.selectedFromDate == null || this.selectedToDate == null) {
                return value = {
                    'aggregate':
                    [
                        {
                            $project: {
                                _id: 1, HRID: 1, Name: 1, State: 1, CreateTime: 1,
                                Tasks: { $slice: ['$Tasks', -1] },
                                Vendor: '$User.UserName'
                            }
                        },
                        {
                            $match: {
                                'Tasks.Type': 'Delivery',
                            },
                        },
                        {
                            $group: {
                                _id: {
                                    Vendor: '$Vendor',
                                    Time:
                                    {
                                        $dateToString:
                                        {
                                            format: this.aggregateBy.id as string, date: '$CreateTime'
                                        }
                                    }
                                },
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
                                Vendor: '$User.UserName'
                            }
                        },
                        {
                            $match: {
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
                                _id: {
                                    Vendor: '$Vendor',
                                    Time:
                                    {
                                        $dateToString:
                                        {
                                            format: this.aggregateBy.id as string, date: '$CreateTime'
                                        }
                                    }
                                },
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
}

class VendorSegment {

    id: string = null;
}

class DataSegment {

    Vendor: string = null;
    DateCounts: Array<DateCount> = new Array<DateCount>();
}

class DateCount {

    date: string; count: Number;
}
