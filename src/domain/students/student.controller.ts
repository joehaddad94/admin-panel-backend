import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { StudentMediator } from 'src/domain/students/student.mediator';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  DeleteResponse,
  UpdateResponse,
  StudentResponse,
} from 'src/core/config/documentation';
import { CreateStudentDto } from './dto/create.student.dto';
import { UpdateStudentDto } from './dto/update.student.dto';

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
