export interface WidgetConfig {
    query: any;
    connectionId: string;
    collectionName: string;
    type: string;
    datamap: { [key: string]: any };
    config: any;
}
