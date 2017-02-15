"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var ng2_charts_1 = require("ng2-charts");
var http_1 = require("@angular/http");
// Local Modules
var index_1 = require("../navbar/index");
var index_2 = require("../shared/letter-avatar/index");
var index_3 = require("../data/index");
var dashboard_event_service_1 = require("./dashboard-event.service");
// Local Components
var index_4 = require("./index");
var index_5 = require("../sidebar/index");
var index_6 = require("../footer/index");
var index_7 = require("../dashview-header/index");
var index_8 = require("../glimpse/index");
var DashboardModule = (function () {
    function DashboardModule() {
    }
    return DashboardModule;
}());
DashboardModule = __decorate([
    core_1.NgModule({
        declarations: [
            index_4.DashboardComponent,
            index_5.SidebarComponent,
            index_6.FooterComponent,
            index_7.DashviewHeaderComponent,
            index_8.GlimpseComponent
        ],
        exports: [
            index_4.DashboardComponent,
        ],
        imports: [
            router_1.RouterModule,
            common_1.CommonModule,
            index_1.NavbarModule,
            index_2.LetterAvatarModule,
            ng2_charts_1.ChartsModule,
            http_1.HttpModule,
            index_3.DataModule
        ],
        providers: dashboard_event_service_1.DASHBOARD_PROVIDERS.slice()
    })
], DashboardModule);
exports.DashboardModule = DashboardModule;

//# sourceMappingURL=dashboard.module.js.map
