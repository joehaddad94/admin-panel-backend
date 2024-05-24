import { QuizQuestions } from '@core/data/database';
import { BaseService } from '@core/settings/base/service/base.service';
import { Injectable } from '@nestjs/common';
import { QuizQuestionsRepository } from '@domain/quizQuestions/quiz.questions.repository';
import { QuestionAnswer } from '@core/data/types/questions/questions.answer';
import { Quiz } from '@core/data/database/entities/quiz.entity';

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
