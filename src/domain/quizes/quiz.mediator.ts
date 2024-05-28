import { Injectable } from '@nestjs/common';
import { QuizService } from 'src/domain/quizes/quiz.service';
import { CreateQuizDto } from 'src/domain/quizes';
import { StudentService } from 'src/domain/students/student.service';
import { throwNotFound } from 'src/core/settings/base/errors/errors';
import { catcher } from 'src/core/helpers/operation';
import { QuizQuestionsService } from 'src/domain/quizQuestions/quiz.questions.service';

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
