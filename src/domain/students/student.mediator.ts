import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create.student.dto';
import { StudentService } from './student.service';
import { catcher } from '../../core/helpers/operation';
import {
  throwBadRequest,
  throwNotFound,
} from '../../core/settings/base/errors/errors';

@Injectable()
export class StudentMediator {
  constructor(private readonly service: StudentService) {}

  create = async (data: CreateStudentDto) => {
    return catcher(async () => {
      const found = await this.service.findOne({
        email: data.email,
      });

      throwBadRequest({
        message: 'Email already in use',
        errorCheck: found !== null,
      });

      const created = this.service.create(data);

      await created.save();

      return created;
    });
  };

  findStudents = async (id?: string) => {
    return catcher(async () => {
      if (id) {
        const parsed = parseInt(id);

        const found = await this.service.findOne(
          {
            id: parsed,
          },
          ['quiz'],
        );

        throwNotFound({
          message: 'Student not found',
          errorCheck: !found,
        });

        return found;
      }

      const found = await this.service.findMany({}, ['quiz']);

      return found.map((student) => {
        student.interviewDate = new Date(student.interviewDate);

        return student;
      });
    });
  };

  updateStudent = async (id: string, data: CreateStudentDto) => {
    return catcher(async () => {
      const parsed = parseInt(id);

      const found = await this.service.findOne({
        id: parsed,
      });

      throwNotFound({
        message: 'Student not found',
        errorCheck: !found,
      });

      const updated = this.service.update(
        {
          id: parsed,
        },
        data,
      );

      return updated;
    });
  };

  deleteStudent = async (id: string) => {
    return catcher(async () => {
      const parsed = parseInt(id);

      const result = await this.service.delete({
        id: parsed,
      });

      throwNotFound({
        message: 'Student not found',
        errorCheck: result.affected === 0,
      });

      return result;
    });
  };
}
