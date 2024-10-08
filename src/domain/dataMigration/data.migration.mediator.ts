import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { DataMigrationDto } from './dtos/data.migration.dto';

@Injectable()
export class DataMigrationMediator {
  blomBankMigration(DataMigrationDto: DataMigrationDto) {
    const { sourceFilePath } = DataMigrationDto;

    try {
      const base64Data = sourceFilePath.split(',')[1];

      const fileBuffer = Buffer.from(base64Data, 'base64');
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
          Amount: row[amountIndex] || '',
          Payee: '',
          Narrative: row[narrativeIndex] || '',
          Reference: '',
          'Cheque Number': '',
        });
      }

      const mappedData = formattedData.map((row: any) => ({
        Date: row['Business Date'] || '',
        Amount: row['Amount'] || '',
        Payee: '',
        Description: row['Narrative'] || '',
        Reference: row['Reference'] || '',
        'Cheque Number': row['Cheque Number'] || '',
      }));

      const newSheet = XLSX.utils.json_to_sheet(mappedData, {
        header: [
          'Date',
          'Amount',
          'Payee',
          'Description',
          'Reference',
          'Cheque Number',
        ],
      });

      const csvData = XLSX.utils.sheet_to_csv(newSheet);
      const buffer = Buffer.from(csvData, 'utf-8');
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
      const base64Data = sourceFilePath.split(',')[1];

      const fileBuffer = Buffer.from(base64Data, 'base64');
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
          Amount: amount || '',
          Payee: '',
          Description: row[detailsIndex] || '',
          Reference: '',
          'Cheque Number': '',
        });
      }

      const mappedData = formattedData.map((row: any) => ({
        Date: row['Date'] || '',
        Amount: row['Amount'] || '',
        Payee: row['Payee'] || '',
        Description: row['Description'] || '',
        Reference: row['Reference'] || '',
        'Cheque Number': row['Cheque Number'] || '',
      }));

      const newSheet = XLSX.utils.json_to_sheet(mappedData, {
        header: [
          'Date',
          'Amount',
          'Payee',
          'Description',
          'Reference',
          'Cheque Number',
        ],
      });

      const csvData = XLSX.utils.sheet_to_csv(newSheet);
      const buffer = Buffer.from(csvData, 'utf-8');
      return buffer;
    } catch (error) {
      throw new HttpException(
        `Error processing file: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
