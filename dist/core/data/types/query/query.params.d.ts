import { GlobalEntities } from './global.entities';
export type QueryParams = {
    relationLoadStrategy?: 'join' | 'query';
    populate?: boolean;
    relations?: GlobalEntities[];
};
