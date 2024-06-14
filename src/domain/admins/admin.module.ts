import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'src/core/data/database';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  controllers: [],
  providers: [],
  exports: [],
})
export class AdminModule {}
