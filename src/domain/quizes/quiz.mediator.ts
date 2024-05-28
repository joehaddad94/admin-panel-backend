import { Injectable } from '@nestjs/common';
import { QuizQuestionsService } from '../quizQuestions/quiz.questions.service';
import { StudentService } from '../students/student.service';
import { CreateQuizDto } from './dtos/create.quiz.dto';
import { QuizService } from './quiz.service';
import { catcher } from '../../core/helpers/operation';
import { throwNotFound } from '../../core/settings/base/errors/errors';

@Injectable()
export class QuizMediator {
  constructor(
    private readonly service: QuizService,
    private readonly studentService: StudentService,
    private readonly quizQuestions: QuizQuestionsService,
  ) {}

  findQuizes = async () => {
    return catcher(async () => {
      const found = await this.service.findMany({}, ['student', 'questions']);

      throwNotFound({
        entity: 'Student',
        errorCheck: !found,
      });

      return found;
    });
  };

  create = async (data: CreateQuizDto) => {
    return catcher(async () => {
      const student = await this.studentService.findOne({ id: data.studentId });

      throwNotFound({
        entity: 'Student',
        errorCheck: !student,
      });

      const { studentId, answers, ...quiz } = data;

      const quizEntity = this.service.create({
        ...quiz,
        studentId: studentId,
      });

      const created = await quizEntity.save();

      await this.quizQuestions.createMany(answers, created);

      return created;
    });
  };
}
