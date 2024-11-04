import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { DataMigrationMediator } from './data.migration.mediator';
import { DataMigrationDto } from './dtos/data.migration.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('dataMigration')
@Controller()
export class DataMigrationController {
  constructor(private readonly mediator: DataMigrationMediator) {}

  @Post('data-migration')
  async dataMigration(
    @Body() dataMigrationDto: DataMigrationDto,
    @Res() res: Response,
  ) {
    const { category } = dataMigrationDto;

    try {
      let fileBuffer: Buffer;
      let filename = '';

      switch (category) {
        case 'blom_bank':
          fileBuffer = await this.mediator.blomBankMigration(dataMigrationDto);
          // filename = 'blom_bank_migration.xlsx';
          filename = 'blom_bank_migration.csv';
          break;
        case 'whish':
          fileBuffer = await this.mediator.whishMigration(dataMigrationDto);
          // filename = 'whish_migration.xlsx';
          filename = 'whish_migration.csv';
          break;
        default:
          throw new HttpException(
            'Unsupported Category',
            HttpStatus.BAD_REQUEST,
          );
      }

      // Set headers for the file download
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

      // Set Content-Type for CSV
      res.setHeader('Content-Type', 'text/csv');

      console.log(res.getHeaders());

      // Send the file buffer as the response
      res.status(HttpStatus.OK).send(fileBuffer);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Data migration Failed',
        error: error.message,
      });
    }
  }
}
