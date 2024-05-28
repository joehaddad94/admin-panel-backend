import { Injectable } from '@nestjs/common';

import { CreateQuestionDto } from './dtos/create.question.dto';
import { QuestionService } from './question.service';
import { catcher } from '../../core/helpers/operation';
import { throwNotFound } from '../../core/settings/base/errors/errors';

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
