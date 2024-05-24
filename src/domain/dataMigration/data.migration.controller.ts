import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { DataMigrationMediator } from './data.migration.mediator';
import { DataMigrationDto } from './dtos/data.migration.dto';
import { Response } from 'express';

@Controller()
export class DataMigrationController {
  constructor(private readonly mediator: DataMigrationMediator) {}

  @Post('data-migration')
  dataMigration(
    @Body() dataMigrationDto: DataMigrationDto,
    @Res() res: Response,
  ) {
    const { category } = dataMigrationDto;

    try {
      let targetFilePath;
      switch (category) {
        case 'blom_bank':
          targetFilePath = this.mediator.blomBankMigration(dataMigrationDto);
          break;
        case 'whish':
          targetFilePath = this.mediator.whishMigration(dataMigrationDto);
          break;

        default:
          throw new HttpException(
            'Unsupported Category',
            HttpStatus.BAD_REQUEST,
          );
      }

      res.status(HttpStatus.OK).json({
        message: 'Data Migration Successfull',
        targetFilePath,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Data migration Failed',
        error: error.message,
      });
    }
  }
}
