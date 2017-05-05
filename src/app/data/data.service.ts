import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { CONSTANTS, LoggerService, LocalStorage } from '../shared/index';
import { AuthConstants } from '../auth/auth.constants';
import { DashboardConfig } from './dashboard/dashboard-config';
import { WidgetConfig } from '../ui-toolbox/index';
import { HttpUtility } from './http-utility';

@Injectable()
export class DataService {
    /**
     * Generic service towards DataCat
     */
    constructor(
        private http: Http,
        private loggerService: LoggerService,
        private localStorage: LocalStorage) {
        this.loggerService.info('data service initialized');
    }

    executeAggregation(connectionId: string, collectionName: string, aggregateDocument: any) {
        let aggUrl = CONSTANTS.ENV.API_BASE + 'data/' + connectionId + '/' + collectionName + '/a';

        let headers = new Headers();
        HttpUtility.setContentTypeAsJson(headers);
        HttpUtility.setAuthHeaders(headers, this.localStorage);

        let options: RequestOptions = new RequestOptions({ headers: headers });
        return this.http.post(aggUrl, aggregateDocument, options)
            .map((res: Response) => {
                HttpUtility.ensureSuccessStatus(res);
                return this._extractData(res);
            })
            .catch((error: Response) => {
                return HttpUtility.extractError(error);
            });
    }

    // INFO: Temporary test method to test out how a widget could have behaved.
    getWidgetConfig(widgetId: string): Observable<WidgetConfig> {
        let widgetUrl = CONSTANTS.ENV.API_BASE + 'widget/' + widgetId;

        let headers = new Headers();
        HttpUtility.setContentTypeAsJson(headers);
        HttpUtility.setAuthHeaders(headers, this.localStorage);

        let options: RequestOptions = new RequestOptions({ headers: headers });
        return this.http.get(widgetUrl, options)
            .map((res: Response) => {
                HttpUtility.ensureSuccessStatus(res);
                let widgetConfig = <DashboardConfig>this._extractData(res);
                return widgetConfig;
            })
            .catch((error: Response) => {
                return HttpUtility.extractError(error);
            });
    }

    getSampleDashboard(): Observable<DashboardConfig> {
        let sampleDashboardId = '58f116a05e1d730001867cbb';
        let dashboardUrl = CONSTANTS.ENV.API_BASE + 'dashboard/' + sampleDashboardId;

        let headers = new Headers();
        HttpUtility.setContentTypeAsJson(headers);
        HttpUtility.setAuthHeaders(headers, this.localStorage);

        let options: RequestOptions = new RequestOptions({ headers: headers });
        return this.http.get(dashboardUrl, options)
            .map((res: Response) => {
                HttpUtility.ensureSuccessStatus(res);
                // TODO: Need dashboard types
                let dashboardConfig = <DashboardConfig>this._extractData(res);
                return dashboardConfig;
            })
            .catch((error: Response) => {
                return HttpUtility.extractError(error);
            });
    }

    private _extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}
