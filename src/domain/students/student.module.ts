import { Module } from '@nestjs/common';
import { StudentsController } from 'src/domain/students/student.controller';
import { StudentMediator } from 'src/domain/students/student.mediator';
import { StudentService } from 'src/domain/students/student.service';
import { StudentRepository } from 'src/domain/students/student.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/core/data/database';

@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  controllers: [StudentsController],
  providers: [StudentMediator, StudentService, StudentRepository],
  exports: [StudentService],
})
export class StudentModule {}
