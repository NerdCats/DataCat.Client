import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';

export function extractError(error: Response | any) {
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

export function ensureSuccessStatus(res: Response) {
    if (res.status < 200 || res.status >= 300) {
        throw new Error('Response status: ' + res.status);
    }
}
