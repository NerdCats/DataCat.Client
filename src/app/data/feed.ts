import { PageEnvelope } from './page-envelope';

export interface Feed<T> {
    pagination: PageEnvelope;
    data: T[];
}
