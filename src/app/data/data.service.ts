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
import { extractError, ensureSuccessStatus } from './http-utility';

@Injectable()
export class DataService {
    /**
     * Generic service towards DataCat
     */
    constructor(
        private http: Http,
        private loggerService: LoggerService,
        private localStorage: LocalStorage) { }

    executeAggregation(connectionId: string, collectionName: string, aggregateDocument: any) {
        let aggUrl = CONSTANTS.ENV.API_BASE + 'data/' + connectionId + '/' + collectionName + '/a';

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'bearer ' + this.localStorage.getObject(AuthConstants.AUTH_TOKEN_KEY).access_token);

        let options: RequestOptions = new RequestOptions({ headers: headers });
        return this.http.post(aggUrl, aggregateDocument, options)
            .map((res: Response) => {
                ensureSuccessStatus(res);
                return this._extractAndSaveData(res);
            })
            .catch((error: Response) => {
                return extractError(error);
            });
    }

    // INFO: Temporary test method to test out how a widget could have behaved.
    getWidgetConfig(widgetId: string): Observable<WidgetConfig> {
        let widgetUrl = CONSTANTS.ENV.API_BASE + 'widget/' + widgetId;

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'bearer ' + this.localStorage.getObject(AuthConstants.AUTH_TOKEN_KEY).access_token);

        let options: RequestOptions = new RequestOptions({ headers: headers });
        return this.http.get(widgetUrl, options)
            .map((res: Response) => {
                ensureSuccessStatus(res);
                let widgetConfig = <DashboardConfig>this._extractAndSaveData(res);
                return widgetConfig;
            })
            .catch((error: Response) => {
                return extractError(error);
            });
    }

    getSampleDashboard(): Observable<DashboardConfig> {
        let sampleDashboardId = '58f116a05e1d730001867cbb';
        let dashboardUrl = CONSTANTS.ENV.API_BASE + 'dashboard/' + sampleDashboardId;

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'bearer ' + this.localStorage.getObject(AuthConstants.AUTH_TOKEN_KEY).access_token);

        let options: RequestOptions = new RequestOptions({ headers: headers });
        return this.http.get(dashboardUrl, options)
            .map((res: Response) => {
                ensureSuccessStatus(res);
                // TODO: Need dashboard types
                let dashboardConfig = <DashboardConfig>this._extractAndSaveData(res);
                return dashboardConfig;
            })
            .catch((error: Response) => {
                return extractError(error);
            });
    }

    private _extractAndSaveData(res: Response) {
        let body = res.json();
        return body || {};
    }
}
