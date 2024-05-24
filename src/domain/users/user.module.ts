import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@core/data/database';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserMediator } from './user.mediator';
import { UserRepository } from './user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserMediator, UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
