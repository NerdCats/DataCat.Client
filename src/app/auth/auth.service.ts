import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { AuthConstants } from './auth.constants';
import { JwtHelper } from 'angular2-jwt';
import { CONSTANTS, LoggerService, LocalStorage } from '../shared/index';

@Injectable()
export class AuthService {
    /**
     * Authentication service for enterprise dashboard
     */
    constructor(
        private http: Http,
        private localStorage: LocalStorage,
        private jwtHelper: JwtHelper,
        private router: Router,
        private loggerService: LoggerService) { }

    login(username: string, password: string) {
        let headers = new Headers();
        let tokenUrl = this._getTokenUrl();

        let urlEncodedParam =
            'grant_type=' + 'password' +
            '&username=' + username +
            '&password=' + password +
            '&client_id=' + CONSTANTS.ENV.CLIENT_ID +
            '&client_secret=' + CONSTANTS.ENV.CLIENT_SECRET +
            '&scope=' + CONSTANTS.ENV.SCOPE;

        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this.http.post(tokenUrl, urlEncodedParam, { headers })
            .map((res: Response) => {
                if (res.status < 200 || res.status >= 300) {
                    throw new Error('Response status: ' + res.status);
                }
                return this._extractAndSaveAuthData(res);
            })
            .catch((error: Response) => {
                return this._extractAuthError(error);
            });
    }

    logout() {
        localStorage.removeItem(AuthConstants.AUTH_TOKEN_KEY);
        /**
         * INFO: We don't know at this point what would be the login route
         * of this app. Since we are guarding it by canActivate we can safely
         * expect that navigating to the login route will the do the right thing
         * and move the app to the login page. But we don't yet know that is the
         * proper route. May be at some point we would want it to have a way
         * to know which would be the proper login route for the app
        */
        this.router.navigate(['/login']);
    }

    private _getTokenUrl() {
        let tokenUrl = CONSTANTS.ENV.AUTH_BASE;
        tokenUrl = CONSTANTS.ENV.AUTH_ENDPOINT ? tokenUrl + CONSTANTS.ENV.AUTH_ENDPOINT : tokenUrl;
        return tokenUrl;
    }

    private _extractAndSaveAuthData(res: Response) {
        let data = res.json();
        if (!data) {
            throw new Error('Invalid/blank auth data, Fatal Error');
        }
        try {
            let userData = this.jwtHelper.decodeToken(data.access_token);
            data.userData = userData;
            this.localStorage.setObject(AuthConstants.AUTH_TOKEN_KEY, data);
        } catch (ex) {
            throw new Error('Fatal error, failed to parse token');
        }
        return true;
    }

    private _extractAuthError(res: Response) {
        let error = res.json();
        let errorMsg = error.error_description || 'Server error';
        this.loggerService.error(errorMsg);
        return Observable.throw(errorMsg);
    }
}
