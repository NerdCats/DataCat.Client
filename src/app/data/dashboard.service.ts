import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { CONSTANTS, LoggerService } from '../shared/index';

@Injectable()
export class DashboardService {
    /**
     * Dashboard api service wrapper towards DataCat
     */
    constructor(
        private http: Http,
        private loggerService: LoggerService) { }

    getDashboardList(user: string) {
        let url = CONSTANTS.ENV.API_BASE + 'dashboard';
    }
}
