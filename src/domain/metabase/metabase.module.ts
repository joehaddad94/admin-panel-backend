import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MetabaseController } from './metabase.controller';
import { MetabaseMediator } from './metabase.mediator';

@Module({
  imports: [ConfigModule],
  controllers: [MetabaseController],
  providers: [MetabaseMediator],
  exports: [MetabaseMediator],
})
export class MetabaseModule {} 