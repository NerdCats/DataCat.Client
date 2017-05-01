import { Observable } from 'rxjs/Observable';
import { Response, Headers } from '@angular/http';
import { AuthConstants } from '../auth/auth.constants';

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
}
