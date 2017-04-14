import { Filter } from './filter';

export interface WidgetConfig {
    query?: any;
    filter?: Filter;
    filterId: string;
    connectionId: string;
    collectionName: string;
    type: string;
    datamap: { [key: string]: any };
    config?: any;
    user: string;
    id: string;
}
