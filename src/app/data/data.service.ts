import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { CONSTANTS, LoggerService, LocalStorage } from '../shared/index';
import { AuthConstants } from '../auth/auth.constants';
import { DashboardConfig, WidgetConfig } from '../ui-toolbox/index';

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
        headers.append('Authorization', 'bearer ' + this.localStorage.getObject('currentUser').access_token);

        let options: RequestOptions = new RequestOptions({ headers: headers });
        return this.http.post(aggUrl, aggregateDocument, options)
            .map((res: Response) => {
                if (res.status < 200 || res.status >= 300) {
                    throw new Error('Response status: ' + res.status);
                }
                return this._extractAndSaveData(res);
            })
            .catch((error: Response) => {
                return this._extractError(error);
            });
    }

    // INFO: Temporary test method to test out how a widget could have behaved.
    getWidgetConfig(widgetId: string): Observable<WidgetConfig> {
        let widgetUrl = CONSTANTS.ENV.API_BASE + 'widget/' + widgetId;

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'bearer ' + this.localStorage.getObject('currentUser').access_token);

        let options: RequestOptions = new RequestOptions({ headers: headers });
        return this.http.get(widgetUrl, options)
            .map((res: Response) => {
                if (res.status < 200 || res.status >= 300) {
                    throw new Error('Response status: ' + res.status);
                }
                let widgetConfig = <DashboardConfig>this._extractAndSaveData(res);
                return widgetConfig;
            })
            .catch((error: Response) => {
                return this._extractError(error);
            });
    }

    getSampleDashboard():  Observable<DashboardConfig> {
        let sampleDashboardId = '58f0c9b850c6704b3cecbe1a';
        let dashboardUrl = CONSTANTS.ENV.API_BASE + 'dashboard/' + sampleDashboardId;

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'bearer ' + this.localStorage.getObject('currentUser').access_token);

        let options: RequestOptions = new RequestOptions({ headers: headers });
        return this.http.get(dashboardUrl, options)
            .map((res: Response) => {
                if (res.status < 200 || res.status >= 300) {
                    throw new Error('Response status: ' + res.status);
                }
                // TODO: Need dashboard types
                let dashboardConfig = <DashboardConfig>this._extractAndSaveData(res);
                return dashboardConfig;
            })
            .catch((error: Response) => {
                return this._extractError(error);
            });
    }

    private _extractAndSaveData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private _extractError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        this.loggerService.error(errMsg);
        return Observable.throw(errMsg);
    }
}
