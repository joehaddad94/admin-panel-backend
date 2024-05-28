import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateStudentDto } from './dto/create.student.dto';
import { UpdateStudentDto } from './dto/update.student.dto';
import { StudentMediator } from './student.mediator';
import {
  StudentResponse,
  UpdateResponse,
  DeleteResponse,
} from '../../core/config/documentation';

@ApiTags('students')
@Controller('students')
export class StudentsController {
  constructor(private readonly mediator: StudentMediator) {}

  @ApiResponse({
    type: StudentResponse,
  })
  @Post()
  async create(@Body() data: CreateStudentDto) {
    return await this.mediator.create(data);
  }

  @ApiResponse({
    type: [StudentResponse] || StudentResponse,
  })
  @ApiParam({
    name: 'id',
    required: false,
  })
  @Get(':id?')
  async find(@Param('id') id?: string) {
    return await this.mediator.findStudents(id);
  }

  @ApiResponse({
    type: UpdateResponse,
  })
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateStudentDto) {
    return await this.mediator.updateStudent(id, data);
  }

  @ApiResponse({
    type: DeleteResponse,
  })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.mediator.deleteStudent(id);
  }
}
