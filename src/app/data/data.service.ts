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
    getSampleWidgetConfig(): any {
        // INLINE query, these needs to be saved in the database of course
        let aggDocument: any = {
            'aggregate': [
                { '$sort': { 'CreateTime': -1 } },
                {
                    '$project': {
                        '_id': 1,
                        'HRID': 1,
                        'CreateTime': 1,
                        'Order.Type': 1,
                        'Order.Variant': 1,
                        'User.Type': 1,
                        'User.UserName': 1,
                        'h': {
                            '$hour': '$CreateTime'
                        },
                        'm': {
                            '$minute': '$CreateTime'
                        },
                        's': {
                            '$second': '$CreateTime'
                        },
                        'ml': {
                            '$millisecond': '$CreateTime'
                        }
                    }
                },
                {
                    '$project': {
                        '_id': 1,
                        'HRID': 1,
                        'Order.Type': 1,
                        'Order.Variant': 1,
                        'User.Type': 1,
                        'User.UserName': 1,
                        'CreateTime': {
                            '$subtract': [
                                '$CreateTime',
                                {
                                    '$add': [
                                        '$ml',
                                        {
                                            '$multiply': [
                                                '$s',
                                                1000
                                            ]
                                        },
                                        {
                                            '$multiply': [
                                                '$m',
                                                60,
                                                1000
                                            ]
                                        },
                                        {
                                            '$multiply': [
                                                '$h',
                                                60,
                                                60,
                                                1000
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                },
                {
                    '$group': {
                        '_id': {
                            'CreateDate': '$CreateTime'
                        },
                        'count': {
                            '$sum': 1
                        },
                        'jobs': {
                            '$push': '$HRID'
                        }
                    }
                }
            ]
        };

        let connectionId = '58e528fe578309a5b84b3906';
        let collectionName = 'Jobs';

        return {
            query: aggDocument,
            connectionId: connectionId,
            collectionName: collectionName,
            type: 'bar-chart',
            datamap: {
                'labels': {
                    path: 'entry._id.CreateDate.$date', // Can be JSONPath?
                    type: 'datestring',
                },
                'datasets': [
                    {
                        label: 'Orders',
                        path: 'count'
                    }
                ]
            }
        };
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
