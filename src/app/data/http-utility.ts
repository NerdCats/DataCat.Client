import { Observable } from 'rxjs/Observable';
import { Response, Headers } from '@angular/http';
import { AuthConstants } from '../auth/auth.constants';
import { CONSTANTS, LoggerService, LocalStorage } from '../shared/index';

export const DefaultPageConfig = {
    DEFAULT_PAGE_SIZE: 20,
    DEFAULT_PAGE: 0,
    PAGE_PARAM: 'page',
    PAGE_SIZE_PARAM: 'pageSize'
};

export class HttpUtility {
    static extractError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
    }

    static ensureSuccessStatus(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Response status: ' + res.status);
        }
    }

    static setContentTypeAsJson(headers: Headers) {
        if (!headers) {
            throw new Error('invalid/null/empty headers set');
        }

        headers.set('Content-Type', 'application/json');
    }

    static setAuthHeaders(headers: Headers, localStorage: LocalStorage) {
        if (!headers) {
            throw new Error('invalid/null/empty headers set');
        }

        if (!localStorage) {
            throw new Error('localStorage service instance not provided');
        }

        headers.set(
            'Authorization',
            'bearer ' + localStorage.getObject(AuthConstants.AUTH_TOKEN_KEY).access_token);
    }
}
