import { QuizService } from '@domain/quizes/quiz.service';
import { CreateQuizDto } from '@domain/quizes';
import { StudentService } from '@domain/students/student.service';
import { QuizQuestionsService } from '@domain/quizQuestions/quiz.questions.service';
export declare class QuizMediator {
    private readonly service;
    private readonly studentService;
    private readonly quizQuestions;
    constructor(service: QuizService, studentService: StudentService, quizQuestions: QuizQuestionsService);
    findQuizes: () => Promise<any>;
    create: (data: CreateQuizDto) => Promise<any>;
}
