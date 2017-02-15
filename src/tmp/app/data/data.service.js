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
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/throw");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
var index_1 = require("../shared/index");
var DataService = (function () {
    /**
     * Generic service towards DataCat
     */
    function DataService(http, loggerService) {
        this.http = http;
        this.loggerService = loggerService;
    }
    DataService.prototype.executeAggregation = function (collectionName, aggregateDocument) {
        var _this = this;
        var aggUrl = index_1.CONSTANTS.ENV.API_BASE + collectionName + '/a';
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(aggUrl, aggregateDocument)
            .map(function (res) {
            if (res.status < 200 || res.status >= 300) {
                throw new Error('Response status: ' + res.status);
            }
            return _this._extractAndSaveData(res);
        })
            .catch(function (error) {
            return _this._extractError(error);
        });
    };
    DataService.prototype._extractAndSaveData = function (res) {
        var body = res.json();
        return body || {};
    };
    DataService.prototype._extractError = function (error) {
        var errMsg;
        if (error instanceof http_1.Response) {
            var body = error.json() || '';
            var err = body.error || JSON.stringify(body);
            errMsg = error.status + " - " + (error.statusText || '') + " " + err;
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        this.loggerService.error(errMsg);
        return Observable_1.Observable.throw(errMsg);
    };
    return DataService;
}());
DataService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        index_1.LoggerService])
], DataService);
exports.DataService = DataService;

//# sourceMappingURL=data.service.js.map
