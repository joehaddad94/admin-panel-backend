import { Injectable } from '@nestjs/common';
import { QuestionService } from 'src/domain/questions/question.service';
import { throwNotFound } from 'src/core/settings/base/errors/errors';
import { catcher } from 'src/core/helpers/operation';
import { CreateQuestionDto } from 'src/domain/questions';

@Injectable()
export class QuestionMediator {
  constructor(private readonly service: QuestionService) {}

  findQuestions = async () => {
    return catcher(async () => {
      const found = await this.service.findMany({});

      throwNotFound({
        entity: 'Question',
        errorCheck: !found,
      });

      return found;
    });
  };

  create = async (data: CreateQuestionDto) => {
    return catcher(async () => {
      const question = this.service.create(data);

      const created = await question.save();

      return created;
    });
  };

  delete = async (id: number) => {
    return catcher(async () => {
      const result = await this.service.delete({ id });

      throwNotFound({
        entity: 'Question',
        errorCheck: result.affected === 0,
      });

      return result;
    });
  };
}
