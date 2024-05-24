import { Module } from '@nestjs/common';
import { StudentsController } from '@domain/students/student.controller';
import { StudentMediator } from '@domain/students/student.mediator';
import { StudentService } from '@domain/students/student.service';
import { StudentRepository } from '@domain/students/student.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '@core/data/database';

@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  controllers: [StudentsController],
  providers: [StudentMediator, StudentService, StudentRepository],
  exports: [StudentService],
})
export class StudentModule {}
