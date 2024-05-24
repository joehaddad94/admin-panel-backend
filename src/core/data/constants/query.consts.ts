import { OnDeleteType } from 'typeorm/metadata/types/OnDeleteType';
import { OnUpdateType } from 'typeorm/metadata/types/OnUpdateType';

type Cascade = {
  onDelete: OnDeleteType;
  onUpdate: OnUpdateType;
};

export const cascade: Cascade = {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
};
