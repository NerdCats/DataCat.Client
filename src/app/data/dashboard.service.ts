import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { CONSTANTS, LoggerService, LocalStorage } from '../shared/index';
import { AuthConstants } from '../auth/auth.constants';
import { Feed } from './feed';
import { DashboardConfig } from './dashboard/dashboard-config';
import { HttpUtility } from './http-utility';

@Injectable()
export class DashboardService {
    /**
     * Dashboard api service wrapper towards DataCat
     */
    private urlBase = CONSTANTS.ENV.API_BASE + 'dashboard';

    constructor(
        private http: Http,
        private loggerService: LoggerService,
        private localStorage: LocalStorage) { }

    getDashboardList(user: string): Observable<Feed<DashboardConfig>> {
        let url = this.urlBase;

        // May be we should write a utility method for this.
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'bearer ' + this.localStorage.getObject(AuthConstants.AUTH_TOKEN_KEY).access_token);

        let options: RequestOptions = new RequestOptions({ headers: headers });

        return this.http.get(url, options)
            .map((res: Response) => {
                HttpUtility.ensureSuccessStatus(res);
                let body = res.json() || {};
                return <Feed<DashboardConfig>>body;
            })
            .catch((error: Response) => {
                return HttpUtility.extractError(error);
            });
    }

    getDashboard(id: string) {
        if (!id) {
            throw new Error('invalid/empty/null id provided');
        }
        let url = this.urlBase + '/' + id;

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'bearer ' + this.localStorage.getObject(AuthConstants.AUTH_TOKEN_KEY).access_token);
    }
}