import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { DataMigrationDto } from './dtos/data.migration.dto';
import * as path from 'path';

@Injectable()
export class DataMigrationMediator {
  blomBankMigration(DataMigrationDto: DataMigrationDto) {
    const { sourceFilePath } = DataMigrationDto;

    try {
      if (!fs.existsSync(sourceFilePath)) {
        throw new HttpException(
          'Source file does not exist',
          HttpStatus.BAD_REQUEST,
        );
      }

      const fileExtension = path.extname(sourceFilePath).toLowerCase();
      if (fileExtension !== '.xls' && fileExtension !== '.xlsx') {
        throw new HttpException(
          'Invalid file type. Only Excel files are allowed',
          HttpStatus.BAD_REQUEST,
        );
      }

      const fileBuffer = fs.readFileSync(sourceFilePath);
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const rawData = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: '',
        range: 3,
      });

      if (rawData.length <= 1) {
        throw new HttpException(
          'Source file is empty or has no valid data',
          HttpStatus.BAD_REQUEST,
        );
      }

      const headers = rawData[0] as string[];

      const businessDateIndex = headers.indexOf('Business Date');
      const narrativeIndex = headers.indexOf('Narrative');
      const amountIndex = headers.indexOf('Amount (USD)');

      if (
        businessDateIndex === -1 ||
        narrativeIndex === -1 ||
        amountIndex === -1
      ) {
        throw new HttpException(
          'Required headers not found in the source file',
          HttpStatus.BAD_REQUEST,
        );
      }

      const formattedData = [];
      for (let i = 1; i < rawData.length; i++) {
        const row = rawData[i];
        const businessDate = row[businessDateIndex];

        if (!businessDate) {
          break;
        }

        formattedData.push({
          'Business Date': businessDate || '',
          Narrative: row[narrativeIndex] || '',
          Amount: row[amountIndex] || '',
        });
      }

      const mappedData = formattedData.map((row: any) => ({
        Date: row['Business Date'] || '',
        Description: row['Narrative'] || '',
        Amount: row['Amount'] || '',
      }));

      const newWorkbook = XLSX.utils.book_new();
      const newSheet = XLSX.utils.json_to_sheet(mappedData);
      XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Xero Data');

      const buffer = XLSX.write(newWorkbook, {
        type: 'buffer',
        bookType: 'xlsx',
      });
      return buffer;
    } catch (error) {
      throw new HttpException(
        `Error processing file: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  whishMigration(dataMigrationDto: DataMigrationDto) {
    const { sourceFilePath } = dataMigrationDto;

    try {
      if (!fs.existsSync(sourceFilePath)) {
        throw new HttpException(
          'Source file does not exist',
          HttpStatus.BAD_REQUEST,
        );
      }

      const filePathExtension = path.extname(sourceFilePath).toLowerCase();
      if (filePathExtension !== '.xls' && filePathExtension !== '.xlsx') {
        throw new HttpException(
          'Invalid file type. Only Excel files are allowed',
          HttpStatus.BAD_REQUEST,
        );
      }

      const fileBuffer = fs.readFileSync(sourceFilePath);
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const rawData = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: '',
        range: 10,
      });

      if (rawData.length === 0) {
        throw new HttpException(
          'Source file is empty or has no valid data',
          HttpStatus.BAD_REQUEST,
        );
      }

      console.log(
        '🚀 ~ DataMigrationMediator ~ whishMigration ~ rawData:',
        rawData,
      );

      const headers = rawData[0] as string[];

      const dateIndex = headers.indexOf('Date');
      const detailsIndex = headers.indexOf('Details');
      const debitIndex = headers.indexOf('Debit');
      const creditIndex = headers.indexOf('Credit');

      if (
        dateIndex === -1 ||
        detailsIndex === -1 ||
        debitIndex === -1 ||
        creditIndex === -1
      ) {
        throw new HttpException(
          'Required headers not found in the source file',
          HttpStatus.BAD_REQUEST,
        );
      }

      const formattedData = [];
      for (let i = 2; i < rawData.length; i++) {
        const row = rawData[i];
        let date = row[dateIndex];

        if (!date) {
          break;
        }

        if (typeof date === 'number') {
          date = XLSX.SSF.format('dd/mm/yyyy', date);
        }

        let amount = 0;
        if (row[debitIndex] !== 0) {
          amount = -Math.abs(Number(row[debitIndex]));
        } else if (row[creditIndex] !== '') {
          amount = Math.abs(Number(row[creditIndex]));
        }

        formattedData.push({
          Date: date || '',
          Description: row[detailsIndex] || '',
          Amount: amount || '',
        });
      }

      console.log(
        '🚀 ~ DataMigrationMediator ~ whishMigration ~ formattedData:',
        formattedData,
      );

      const mappedData = formattedData.map((row: any) => ({
        Date: row['Date'] || '',
        Description: row['Description'] || '',
        Amount: row['Amount'] || '',
      }));
      console.log(
        '🚀 ~ DataMigrationMediator ~ mappedData ~ mappedData:',
        mappedData,
      );

      const newWorkbook = XLSX.utils.book_new();
      const newSheet = XLSX.utils.json_to_sheet(mappedData);
      XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Xero Data');

      const buffer = XLSX.write(newWorkbook, {
        type: 'buffer',
        bookType: 'xlsx',
      });
      return buffer;
    } catch (error) {
      throw new HttpException(
        `Error processing file: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
