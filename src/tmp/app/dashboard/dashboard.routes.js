"use strict";
var dashboard_component_1 = require("./dashboard.component");
var index_1 = require("../glimpse/index");
exports.DashboardRoutes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: 'dashboard',
        component: dashboard_component_1.DashboardComponent,
        children: [
            { path: '', redirectTo: 'glimpse', pathMatch: 'full' },
            { path: 'glimpse', component: index_1.GlimpseComponent }
        ]
    }
];

//# sourceMappingURL=dashboard.routes.js.map
