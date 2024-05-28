import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsController } from './student.controller';
import { StudentMediator } from './student.mediator';
import { StudentRepository } from './student.repository';
import { StudentService } from './student.service';
import { Student } from '../../core/data/database';

@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  controllers: [StudentsController],
  providers: [StudentMediator, StudentService, StudentRepository],
  exports: [StudentService],
})
export class StudentModule {}
