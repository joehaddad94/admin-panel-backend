import { QuizQuestions } from 'src/core/data/database';
import { BaseService } from 'src/core/settings/base/service/base.service';
import { Injectable } from '@nestjs/common';
import { QuizQuestionsRepository } from 'src/domain/quizQuestions/quiz.questions.repository';
import { QuestionAnswer } from 'src/core/data/types/questions/questions.answer';
import { Quiz } from 'src/core/data/database/entities/quiz.entity';

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
