import { Controller, Get } from '@nestjs/common';
import { UserMediator } from './user.mediator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly mediator: UserMediator) {}

  @Get()
  getUsers() {
    return this.mediator.findUsers();
  }
}
