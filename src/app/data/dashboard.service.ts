import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { CONSTANTS, LoggerService, LocalStorage } from '../shared/index';
import { AuthConstants } from '../auth/auth.constants';

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
    }
}
