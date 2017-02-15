"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var dashboard_event_service_1 = require("../dashboard/dashboard-event.service");
var index_1 = require("../data/index");
var index_2 = require("../shared/index");
var GlimpseComponent = (function () {
    function GlimpseComponent(dataService, loggerService, dashboarEventService) {
        this.dataService = dataService;
        this.loggerService = loggerService;
        this.dashboarEventService = dashboarEventService;
        this.barChartOptions = {
            scaleShowVerticalLines: false,
            responsive: true,
            scales: {
                yAxes: [{
                        display: true,
                        ticks: {
                            suggestedMin: 0,
                            // OR //
                            beginAtZero: true,
                            suggestedMax: 100,
                            max: 150
                        }
                    }]
            }
        };
        this.isDataAvailable = false;
        this.barChartLabels = [];
        this.barChartType = 'bar';
        this.barChartLegend = true;
        dashboarEventService.componentUpdated({ Event: 'loaded', Name: 'Glimpse' });
    }
    GlimpseComponent.prototype.ngOnInit = function () {
        var _this = this;
        var document = {
            'aggregate': [
                { '$sort': { 'CreateTime': -1 } },
                {
                    '$project': {
                        '_id': 1,
                        'HRID': 1,
                        'CreateTime': 1,
                        'Order.Type': 1,
                        'Order.Variant': 1,
                        'User.Type': 1,
                        'User.UserName': 1,
                        'h': {
                            '$hour': '$CreateTime'
                        },
                        'm': {
                            '$minute': '$CreateTime'
                        },
                        's': {
                            '$second': '$CreateTime'
                        },
                        'ml': {
                            '$millisecond': '$CreateTime'
                        }
                    }
                },
                {
                    '$project': {
                        '_id': 1,
                        'HRID': 1,
                        'Order.Type': 1,
                        'Order.Variant': 1,
                        'User.Type': 1,
                        'User.UserName': 1,
                        'CreateTime': {
                            '$subtract': [
                                '$CreateTime',
                                {
                                    '$add': [
                                        '$ml',
                                        {
                                            '$multiply': [
                                                '$s',
                                                1000
                                            ]
                                        },
                                        {
                                            '$multiply': [
                                                '$m',
                                                60,
                                                1000
                                            ]
                                        },
                                        {
                                            '$multiply': [
                                                '$h',
                                                60,
                                                60,
                                                1000
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                },
                {
                    '$group': {
                        '_id': {
                            'CreateDate': '$CreateTime'
                        },
                        'count': {
                            '$sum': 1
                        },
                        'jobs': {
                            '$push': '$HRID'
                        }
                    }
                }
            ]
        };
        this.dataService.executeAggregation('Jobs', document)
            .subscribe(function (result) {
            var jobCountArray = [];
            if (result) {
                // Need to parse this crap here
                var res = result;
                for (var _i = 0, res_1 = res; _i < res_1.length; _i++) {
                    var entry = res_1[_i];
                    _this.barChartLabels.push(new Date(entry._id.CreateDate.$date).toDateString());
                    jobCountArray.push(entry.count);
                }
            }
            _this.barChartData = [{ data: jobCountArray, label: 'Orders' }];
            _this.isDataAvailable = true;
        }, function (error) { _this.loggerService.error(error); });
    };
    return GlimpseComponent;
}());
GlimpseComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'as-glimpse',
        templateUrl: 'glimpse.html'
    }),
    __metadata("design:paramtypes", [index_1.DataService,
        index_2.LoggerService,
        dashboard_event_service_1.DashboardEventService])
], GlimpseComponent);
exports.GlimpseComponent = GlimpseComponent;

//# sourceMappingURL=glimpse.component.js.map
