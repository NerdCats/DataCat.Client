import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { CONSTANTS, LoggerService, LocalStorage } from '../shared/index';
import { AuthConstants } from '../auth/auth.constants';
import { WidgetConfig } from '../ui-toolbox/widget/widget-config';

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
    getSampleWidgetConfig(): Observable<WidgetConfig> {
        let sampleWidgetId = '58ece29d4494d50190ea8661';
        let widgetUrl = CONSTANTS.ENV.API_BASE + 'widget/' + sampleWidgetId;

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'bearer ' + this.localStorage.getObject('currentUser').access_token);

        let options: RequestOptions = new RequestOptions({ headers: headers });
        return this.http.get(widgetUrl, options)
            .map((res: Response) => {
                if (res.status < 200 || res.status >= 300) {
                    throw new Error('Response status: ' + res.status);
                }
                let widgetConfig = <WidgetConfig>this._extractAndSaveData(res);
                return widgetConfig;
            })
            .catch((error: Response) => {
                return this._extractError(error);
            });
    }

    getSampleDashboard(): any {
        let dashboardConfig = {
            widgets: [
                {
                    wconfig: {
                        width: 12,
                        color: 'success',
                        title: 'Widget #1'
                    }
                },
                {
                    wconfig: {
                        width: 6,
                        color: 'danger',
                        title: 'Widget #2'
                    }
                },
                {
                    wconfig: {
                        width: 6,
                        color: 'danger',
                        title: 'Widget #2'
                    }
                }
            ]
        };

        return dashboardConfig;
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
