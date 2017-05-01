import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { CONSTANTS, LoggerService, LocalStorage } from '../shared/index';
import { AuthConstants } from '../auth/auth.constants';
import { Feed } from './feed';
import { DashboardConfig } from './dashboard/dashboard-config';
import { HttpUtility, DefaultPageConfig } from './http-utility';

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

    getDashboardList(
        page = DefaultPageConfig.DEFAULT_PAGE,
        pageSize = DefaultPageConfig.DEFAULT_PAGE_SIZE): Observable<Feed<DashboardConfig>> {
        let url = this.urlBase;

        // May be we should write a utility method for this.
        let headers = new Headers();
        HttpUtility.setContentTypeAsJson(headers);
        HttpUtility.setAuthHeaders(headers, this.localStorage);

        let params: URLSearchParams = new URLSearchParams();
        params.set(DefaultPageConfig.PAGE_PARAM, page.toString());
        params.set(DefaultPageConfig.PAGE_SIZE_PARAM, pageSize.toString());

        let options: RequestOptions = new RequestOptions();
        options.headers = headers;
        options.search = params;

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

    getDashboard(id: string): Observable<DashboardConfig> {
        if (!id) {
            throw new Error('invalid/empty/null id provided');
        }
        let url = this.urlBase + '/' + id;

        let headers = new Headers();
        HttpUtility.setContentTypeAsJson(headers);
        HttpUtility.setAuthHeaders(headers, this.localStorage);

        let options: RequestOptions = new RequestOptions({ headers: headers });

        return this.http.get(url, options)
            .map((res: Response) => {
                HttpUtility.ensureSuccessStatus(res);
                let body = res.json() || {};
                return <DashboardConfig>body;
            })
            .catch((error: Response) => {
                return HttpUtility.extractError(error);
            });
    }
}
