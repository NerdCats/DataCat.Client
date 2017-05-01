import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { CONSTANTS, LoggerService, LocalStorage } from '../shared/index';
import { AuthConstants } from '../auth/auth.constants';
import { Feed } from './feed';
import { DashboardConfig } from './dashboard/dashboard-config';
import { extractError } from './http-utility';

@Injectable()
export class DashboardService {
    /**
     * Dashboard api service wrapper towards DataCat
     */
    constructor(
        private http: Http,
        private loggerService: LoggerService,
        private localStorage: LocalStorage) { }

    getDashboardList(user: string) {
        let url = CONSTANTS.ENV.API_BASE + 'dashboard';

        // May be we should write a utility method for this.
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'bearer ' + this.localStorage.getObject(AuthConstants.AUTH_TOKEN_KEY).access_token);

        let options: RequestOptions = new RequestOptions({ headers: headers });

        this.http.get(url, options)
            .map((res: Response) => {
                if (res.status < 200 || res.status >= 300) {
                    throw new Error('Response status: ' + res.status);
                }
                let body = res.json() || {};
                return <Feed<DashboardConfig>>body;
            })
            .catch((error: Response) => {
                return extractError(error);
            });
    }
}
