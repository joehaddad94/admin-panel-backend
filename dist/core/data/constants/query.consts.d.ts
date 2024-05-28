import { OnDeleteType } from 'typeorm/metadata/types/OnDeleteType';
import { OnUpdateType } from 'typeorm/metadata/types/OnUpdateType';
type Cascade = {
    onDelete: OnDeleteType;
    onUpdate: OnUpdateType;
};
export declare const cascade: Cascade;
export {};
