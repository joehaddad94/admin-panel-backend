// import { Body, Controller, Post, Put } from '@nestjs/common';
// import { AuthMediator } from './AuthMediator';
// import { InviteDto } from './dto/invite.dto';
// import { LoginDto } from './dto/login.dto';
// import { VerifyDto } from './dto/verify.dto';
// import { ManualCreateDto } from './dto/manual.create.dto';
// import { ApiResponse, ApiTags } from '@nestjs/swagger';
// import {
//   AdminResponse,
//   InviteResponse,
//   TokenResponse,
// } from '../../core/config/documentation/response_types/auth';

// @ApiTags('auth')
// @Controller('auth')
// export class AuthController {
//   constructor(private readonly mediator: AuthMediator) {}

//   @ApiResponse({
//     type: InviteResponse,
//   })
//   @Post('invite')
//   invite(@Body() data: InviteDto) {
//     return this.mediator.invite(data);
//   }

//   @ApiResponse({
//         type: TokenResponse,
//       })
//       @Post('login')
//       login(@Body() data: LoginDto) {
//             return this.mediator.login(data);
//           }

//   @ApiResponse({
//     type: TokenResponse,
//   })
//   @Put()
//   verify(@Body() data: VerifyDto) {
//     return this.mediator.verify(data);
//   }

//   @ApiResponse({
//     type: AdminResponse,
//   })
//   @Post('manual-create')
//   manualCreate(@Body() data: ManualCreateDto) {
//     return this.mediator.manualCreate(data);
//   }
// }

import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthMediator } from './authMediator';
import { AdminResponse, TokenResponse } from '../../core/config/documentation';
import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { ManualCreateDto } from './dto/manual.create.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly mediator: AuthMediator) {}

  @ApiResponse({
    type: TokenResponse,
  })
  @Post('login')
  login(@Body() data: LoginDto) {
    return this.mediator.login(data);
  }

  @ApiResponse({
    type: AdminResponse,
  })
  @Post('create-admin')
  createAdmin(@Body() data: ManualCreateDto) {
    return this.mediator.manualCreate(data);
  }
}
