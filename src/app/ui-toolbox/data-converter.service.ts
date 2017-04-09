import { Injectable } from '@angular/core';

@Injectable()
export class DataConverterService {
    convert(data: any, targetType: string) {
        switch (targetType) {
            case 'datestring':
                return new Date(data).toDateString();
            default:
                return data;
        }
    }
}
