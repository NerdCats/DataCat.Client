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
    public filterQuery = '';
    public rowsOnPage = 10;
    public sortBy = '_id';
    public sortOrder = 'asc';

    constructor(
        private dataService: DataService,
        private loggerService: LoggerService,
        private dashboarEventService: DashboardEventService) {
        dashboarEventService.componentUpdated({ Event: 'loaded', Name: 'Attempt VS Delivery' });
    }
    ngOnInit() {
        let document: any = {
            'aggregate':
            [
                {
                    $project: {
                        _id: 1, HRID: 1, Name: 1, State: 1, CreateTime: 1, ModifiedTime: 1, CompletionTime: 1, AttemptCount: 1,
                        Tasks: { $slice: ['$Tasks', -1] }
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
        this.dataService.executeAggregation('Jobs', document)
            .subscribe(result => {
                if (result) {
                    this.data = [{ data: result }];
                }
            },
            error => { this.loggerService.error(error); });
    }
}
