import { forEach } from '@angular/router/src/utils/collection';
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
    public data: any[];
    public filterQuery = '';
    public dataSegment: any;

    public vendors: any[];
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
                    if (result) {
                        
                        // this.prepObj(result);
                        // this.data = result;
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
                                    _id: { Vendor: '$Vendor',
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

    // private prepObj(result:any): any{
    //     let preppedObj = {};
    //     for (let oitem in result)
    //     {
    //         if(preppedObj[oitem["_id"]["Vendor"]] === undefined){
    //             preppedObj[oitem["_id"]["Vendor"]] = {};
    //         }
    //     }
    //     console.log(preppedObj);
    //     return preppedObj;
    // }
}
