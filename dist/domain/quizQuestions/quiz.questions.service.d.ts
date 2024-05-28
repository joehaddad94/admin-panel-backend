import { QuizQuestions } from '@core/data/database';
import { BaseService } from '@core/settings/base/service/base.service';
import { QuizQuestionsRepository } from '@domain/quizQuestions/quiz.questions.repository';
import { QuestionAnswer } from '@core/data/types/questions/questions.answer';
import { Quiz } from '@core/data/database/entities/quiz.entity';
export declare class QuizQuestionsService extends BaseService<QuizQuestionsRepository, QuizQuestions> {
    private readonly quizQuestionsRepository;
    constructor(quizQuestionsRepository: QuizQuestionsRepository);
    createMany: (quizQuestions: QuestionAnswer[], quiz: Quiz) => Promise<import("typeorm").InsertResult>;
}
