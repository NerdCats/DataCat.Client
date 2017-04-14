import { Filter } from './filter';

export interface WidgetConfig {
    filter?: Filter;
    filterId: string;
    connectionId: string;
    collectionName: string;
    type: string;
    dataMap: { [key: string]: any };
    config?: any;
    user: string;
    id: string;
}
