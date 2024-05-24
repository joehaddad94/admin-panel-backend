import { Module } from '@nestjs/common';
import { DataMigrationController } from './data.migration.controller';
import { DataMigrationMediator } from './data.migration.mediator';

@Module({
  imports: [],
  controllers: [DataMigrationController],
  providers: [DataMigrationMediator],
  exports: [],
})
export class DataMigrationModule {}
