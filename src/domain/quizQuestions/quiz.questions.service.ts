import { Injectable } from '@nestjs/common';
import { QuizQuestionsRepository } from './quiz.questions.repository';
import { QuizQuestions, Quiz } from '../../core/data/database';
import { QuestionAnswer } from '../../core/data/types';
import { BaseService } from '../../core/settings/base/service/base.service';

@Injectable()
export class QuizQuestionsService extends BaseService<
  QuizQuestionsRepository,
  QuizQuestions
> {
  constructor(
    private readonly quizQuestionsRepository: QuizQuestionsRepository,
  ) {
    super(quizQuestionsRepository);
  }

  createMany = async (quizQuestions: QuestionAnswer[], quiz: Quiz) => {
    const quizQuestionsQuery = this.quizQuestionsRepository.getQueryBuilder();

    const created = await quizQuestionsQuery
      .insert()
      .values(
        quizQuestions.map((question) => ({
          quizId: quiz.id,
          questionId: question.questionId,
          answer: question.answer,
          correct: question.correct,
          rating: question.rating,
        })),
      )
      .execute();

    return created;
  };
}
