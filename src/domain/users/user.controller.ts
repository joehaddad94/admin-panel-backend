import { Controller, Get } from '@nestjs/common';
import { UserMediator } from './user.mediator';

@Controller('users')
export class UserController {
  constructor(private readonly mediator: UserMediator) {}

  @Get()
  getUsers() {
    return this.mediator.findUsers();
  }
}
