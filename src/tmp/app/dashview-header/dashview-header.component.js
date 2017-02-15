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
var DashviewHeaderComponent = (function () {
    function DashviewHeaderComponent(dashboardEventService) {
        var _this = this;
        this.dashboardEventService = dashboardEventService;
        this.pageHeader = 'Loading';
        this.optionalDescription = '';
        this.dashboardEventService.componentUpdated$.subscribe(function (event) {
            _this.pageHeader = event.Name;
            _this.breadcrumbDef = [event.Name];
        });
    }
    return DashviewHeaderComponent;
}());
DashviewHeaderComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'as-dashview-header',
        templateUrl: 'dashview-header.html'
    }),
    __metadata("design:paramtypes", [dashboard_event_service_1.DashboardEventService])
], DashviewHeaderComponent);
exports.DashviewHeaderComponent = DashviewHeaderComponent;

//# sourceMappingURL=dashview-header.component.js.map
