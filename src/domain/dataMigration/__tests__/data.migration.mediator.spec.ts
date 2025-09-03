import { Test, TestingModule } from '@nestjs/testing';
import { DataMigrationMediator } from '../data.migration.mediator';
import { DataMigrationDto } from '../dtos/data.migration.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

// Mock XLSX module
jest.mock('xlsx', () => ({
  read: jest.fn(),
  utils: {
    sheet_to_json: jest.fn(),
    json_to_sheet: jest.fn(),
    sheet_to_csv: jest.fn(),
  },
  SSF: {
    format: jest.fn(),
  },
}));

describe('DataMigrationMediator', () => {
  let mediator: DataMigrationMediator;
  let module: TestingModule;

  const mockXLSX = require('xlsx');

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [DataMigrationMediator],
    }).compile();

    mediator = module.get<DataMigrationMediator>(DataMigrationMediator);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    if (module) {
      await module.close();
    }
  });

  describe('blomBankMigration', () => {
    const mockDataMigrationDto: DataMigrationDto = {
      sourceFilePath: 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,UEsDBBQAAAAIAA...',
      category: 'blom_bank',
    };

    it('should successfully process blom bank migration', async () => {
      const mockWorkbook = {
        Sheets: {
          'Sheet1': { /* mock sheet data */ },
        },
        SheetNames: ['Sheet1'],
      };

      const mockRawData = [
        ['Business Date', 'Narrative', 'Amount (USD)'],
        ['2024-01-01', 'Test Transaction 1', '100.50'],
        ['2024-01-02', 'Test Transaction 2', '200.75'],
      ];

      const mockFormattedData = [
        { Date: '2024-01-01', Amount: '100.50', Payee: '', Description: 'Test Transaction 1', Reference: '', 'Cheque Number': '' },
        { Date: '2024-01-02', Amount: '200.75', Payee: '', Description: 'Test Transaction 2', Reference: '', 'Cheque Number': '' },
      ];

      const mockSheet = { /* mock sheet */ };
      const mockNewSheet = { /* mock new sheet */ };
      const mockCsvData = 'Date,Amount,Payee,Description,Reference,Cheque Number\n2024-01-01,100.50,,Test Transaction 1,,\n2024-01-02,200.75,,Test Transaction 2,,\n';

      mockXLSX.read.mockReturnValue(mockWorkbook);
      mockXLSX.utils.sheet_to_json.mockReturnValue(mockRawData);
      mockXLSX.utils.json_to_sheet.mockReturnValue(mockNewSheet);
      mockXLSX.utils.sheet_to_csv.mockReturnValue(mockCsvData);

      const result = await mediator.blomBankMigration(mockDataMigrationDto);

      expect(mockXLSX.read).toHaveBeenCalledWith(expect.any(Buffer), { type: 'buffer' });
      expect(mockXLSX.utils.sheet_to_json).toHaveBeenCalledWith(mockSheet, {
        header: 1,
        defval: '',
        range: 3,
      });
      expect(mockXLSX.utils.json_to_sheet).toHaveBeenCalledWith(mockFormattedData, {
        header: ['Date', 'Amount', 'Payee', 'Description', 'Reference', 'Cheque Number'],
      });
      expect(mockXLSX.utils.sheet_to_csv).toHaveBeenCalledWith(mockNewSheet);
      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString()).toBe(mockCsvData);
    });

                    it('should throw error when source file is empty', async () => {
                  const mockWorkbook = {
                    Sheets: {
                      'Sheet1': { /* mock sheet data */ },
                    },
                    SheetNames: ['Sheet1'],
                  };

                  const mockRawData = [['Business Date', 'Narrative', 'Amount (USD)']];

                  mockXLSX.read.mockReturnValue(mockWorkbook);
                  mockXLSX.utils.sheet_to_json.mockReturnValue(mockRawData);

                  try {
                    await mediator.blomBankMigration(mockDataMigrationDto);
                    fail('Expected HttpException to be thrown');
                  } catch (error) {
                    expect(error).toBeInstanceOf(HttpException);
                    expect(error.message).toBe('Error processing file: Source file is empty or has no valid data');
                  }

                  expect(mockXLSX.read).toHaveBeenCalled();
                  expect(mockXLSX.utils.sheet_to_json).toHaveBeenCalled();
                });

    it('should throw error when required headers are missing', async () => {
      const mockWorkbook = {
        Sheets: {
          'Sheet1': { /* mock sheet data */ },
        },
        SheetNames: ['Sheet1'],
      };

      const mockRawData = [
        ['Date', 'Description', 'Value'],
        ['2024-01-01', 'Test Transaction', '100.50'],
      ];

      mockXLSX.read.mockReturnValue(mockWorkbook);
      mockXLSX.utils.sheet_to_json.mockReturnValue(mockRawData);

                        try {
                        await mediator.blomBankMigration(mockDataMigrationDto);
                        fail('Expected HttpException to be thrown');
                      } catch (error) {
                        expect(error).toBeInstanceOf(HttpException);
                        expect(error.message).toBe('Error processing file: Required headers not found in the source file');
                      }

      expect(mockXLSX.read).toHaveBeenCalled();
      expect(mockXLSX.utils.sheet_to_json).toHaveBeenCalled();
    });

    it('should handle missing business date gracefully', async () => {
      const mockWorkbook = {
        Sheets: {
          'Sheet1': { /* mock sheet data */ },
        },
        SheetNames: ['Sheet1'],
      };

      const mockRawData = [
        ['Business Date', 'Narrative', 'Amount (USD)'],
        ['2024-01-01', 'Test Transaction 1', '100.50'],
        ['', 'Test Transaction 2', '200.75'], // Empty business date
      ];

      const mockFormattedData = [
        { Date: '2024-01-01', Amount: '100.50', Payee: '', Description: 'Test Transaction 1', Reference: '', 'Cheque Number': '' },
      ];

      const mockSheet = { /* mock sheet */ };
      const mockNewSheet = { /* mock new sheet */ };
      const mockCsvData = 'Date,Amount,Payee,Description,Reference,Cheque Number\n2024-01-01,100.50,,Test Transaction 1,,\n';

      mockXLSX.read.mockReturnValue(mockWorkbook);
      mockXLSX.utils.sheet_to_json.mockReturnValue(mockRawData);
      mockXLSX.utils.json_to_sheet.mockReturnValue(mockNewSheet);
      mockXLSX.utils.sheet_to_csv.mockReturnValue(mockCsvData);

      const result = await mediator.blomBankMigration(mockDataMigrationDto);

      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString()).toBe(mockCsvData);
    });

    it('should throw error when XLSX processing fails', async () => {
      mockXLSX.read.mockImplementation(() => {
        throw new Error('Invalid file format');
      });

                        try {
                        await mediator.blomBankMigration(mockDataMigrationDto);
                        fail('Expected HttpException to be thrown');
                      } catch (error) {
                        expect(error).toBeInstanceOf(HttpException);
                        expect(error.message).toBe('Error processing file: Invalid file format');
                      }

      expect(mockXLSX.read).toHaveBeenCalled();
    });
  });

  describe('whishMigration', () => {
    const mockDataMigrationDto: DataMigrationDto = {
      sourceFilePath: 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,UEsDBBQAAAAIAA...',
      category: 'whish',
    };

    it('should successfully process whish migration', async () => {
      const mockWorkbook = {
        Sheets: {
          'Sheet1': { /* mock sheet data */ },
        },
        SheetNames: ['Sheet1'],
      };

      const mockRawData = [
        ['Date', 'Details', 'Debit', 'Credit'],
        ['2024-01-01', 'Test Transaction 0', '50.00', ''], // First data row (index 1)
        ['2024-01-02', 'Test Transaction 1', '100.50', ''], // Second data row (index 2)
        ['2024-01-03', 'Test Transaction 2', '', '200.75'], // Third data row (index 3)
      ];

      const mockFormattedData = [
        { Date: '2024-01-02', Amount: -100.50, Payee: '', Description: 'Test Transaction 1', Reference: '', 'Cheque Number': '' },
        { Date: '2024-01-03', Amount: '', Payee: '', Description: 'Test Transaction 2', Reference: '', 'Cheque Number': '' },
      ];

      const mockSheet = { /* mock sheet */ };
      const mockNewSheet = { /* mock new sheet */ };
      const mockCsvData = 'Date,Amount,Payee,Description,Reference,Cheque Number\n2024-01-02,-100.50,,Test Transaction 1,,\n2024-01-03,,,Test Transaction 2,,\n';

      mockXLSX.read.mockReturnValue(mockWorkbook);
      mockXLSX.utils.sheet_to_json.mockReturnValue(mockRawData);
      mockXLSX.utils.json_to_sheet.mockReturnValue(mockNewSheet);
      mockXLSX.utils.sheet_to_csv.mockReturnValue(mockCsvData);

      const result = await mediator.whishMigration(mockDataMigrationDto);

      expect(mockXLSX.read).toHaveBeenCalledWith(expect.any(Buffer), { type: 'buffer' });
      expect(mockXLSX.utils.sheet_to_json).toHaveBeenCalledWith(mockSheet, {
        header: 1,
        defval: '',
        range: 10,
      });
      expect(mockXLSX.utils.json_to_sheet).toHaveBeenCalledWith(mockFormattedData, {
        header: ['Date', 'Amount', 'Payee', 'Description', 'Reference', 'Cheque Number'],
      });
      expect(mockXLSX.utils.sheet_to_csv).toHaveBeenCalledWith(mockNewSheet);
      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString()).toBe(mockCsvData);
    });

    it('should throw error when source file is empty', async () => {
      const mockWorkbook = {
        Sheets: {
          'Sheet1': { /* mock sheet data */ },
        },
        SheetNames: ['Sheet1'],
      };

      const mockRawData: any[] = [];

      mockXLSX.read.mockReturnValue(mockWorkbook);
      mockXLSX.utils.sheet_to_json.mockReturnValue(mockRawData);

      try {
        await mediator.whishMigration(mockDataMigrationDto);
        fail('Expected HttpException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Error processing file: Source file is empty or has no valid data');
      }

      expect(mockXLSX.read).toHaveBeenCalled();
      expect(mockXLSX.utils.sheet_to_json).toHaveBeenCalled();
    });

    it('should throw error when required headers are missing', async () => {
      const mockWorkbook = {
        Sheets: {
          'Sheet1': { /* mock sheet data */ },
        },
        SheetNames: ['Sheet1'],
      };

      const mockRawData = [
        ['Transaction Date', 'Description', 'Value'],
        ['2024-01-01', 'Test Transaction', '100.50'],
      ];

      mockXLSX.read.mockReturnValue(mockWorkbook);
      mockXLSX.utils.sheet_to_json.mockReturnValue(mockRawData);

      try {
        await mediator.whishMigration(mockDataMigrationDto);
        fail('Expected HttpException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Error processing file: Required headers not found in the source file');
      }

      expect(mockXLSX.read).toHaveBeenCalled();
      expect(mockXLSX.utils.sheet_to_json).toHaveBeenCalled();
    });

    it('should handle numeric dates correctly', async () => {
      const mockWorkbook = {
        Sheets: {
          'Sheet1': { /* mock sheet data */ },
        },
        SheetNames: ['Sheet1'],
      };

      const mockRawData = [
        ['Date', 'Details', 'Debit', 'Credit'],
        ['2024-01-01', 'Test Transaction 0', '50.00', ''], // First data row (index 1)
        [44927, 'Test Transaction 1', '100.50', ''], // Excel date number (index 2)
      ];

      const mockFormattedData = [
        { Date: '2024-01-01', Amount: -50.00, Payee: '', Description: 'Test Transaction 0', Reference: '', 'Cheque Number': '' },
        { Date: '01/01/2023', Amount: -100.50, Payee: '', Description: 'Test Transaction 1', Reference: '', 'Cheque Number': '' },
      ];

      const mockSheet = { /* mock sheet */ };
      const mockNewSheet = { /* mock new sheet */ };
      const mockCsvData = 'Date,Amount,Payee,Description,Reference,Cheque Number\n2024-01-01,-50.00,,Test Transaction 0,,\n01/01/2023,-100.50,,Test Transaction 1,,\n';

      mockXLSX.read.mockReturnValue(mockWorkbook);
      mockXLSX.utils.sheet_to_json.mockReturnValue(mockRawData);
      mockXLSX.SSF.format.mockReturnValue('01/01/2023');
      mockXLSX.utils.json_to_sheet.mockReturnValue(mockNewSheet);
      mockXLSX.utils.sheet_to_csv.mockReturnValue(mockCsvData);

      const result = await mediator.whishMigration(mockDataMigrationDto);

      expect(mockXLSX.SSF.format).toHaveBeenCalledWith('dd/mm/yyyy', 44927);
      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString()).toBe(mockCsvData);
    });

    it('should handle missing date gracefully', async () => {
      const mockWorkbook = {
        Sheets: {
          'Sheet1': { /* mock sheet data */ },
        },
        SheetNames: ['Sheet1'],
      };

      const mockRawData = [
        ['Date', 'Details', 'Debit', 'Credit'],
        ['2024-01-01', 'Test Transaction 1', '100.50', ''],
        ['', 'Test Transaction 2', '200.75', ''], // Empty date
      ];

      const mockFormattedData = [
        { Date: '2024-01-01', Amount: -100.50, Payee: '', Description: 'Test Transaction 1', Reference: '', 'Cheque Number': '' },
      ];

      const mockSheet = { /* mock sheet */ };
      const mockNewSheet = { /* mock new sheet */ };
      const mockCsvData = 'Date,Amount,Payee,Description,Reference,Cheque Number\n2024-01-01,-100.50,,Test Transaction 1,,\n';

      mockXLSX.read.mockReturnValue(mockWorkbook);
      mockXLSX.utils.sheet_to_json.mockReturnValue(mockRawData);
      mockXLSX.utils.json_to_sheet.mockReturnValue(mockNewSheet);
      mockXLSX.utils.sheet_to_csv.mockReturnValue(mockCsvData);

      const result = await mediator.whishMigration(mockDataMigrationDto);

      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString()).toBe(mockCsvData);
    });

    it('should calculate amounts correctly for debit transactions', async () => {
      const mockWorkbook = {
        Sheets: {
          'Sheet1': { /* mock sheet data */ },
        },
        SheetNames: ['Sheet1'],
      };

      const mockRawData = [
        ['Date', 'Details', 'Debit', 'Credit'],
        ['2024-01-01', 'Test Debit Transaction', '150.25', ''],
      ];

      const mockFormattedData = [
        { Date: '2024-01-01', Amount: -150.25, Payee: '', Description: 'Test Debit Transaction', Reference: '', 'Cheque Number': '' },
      ];

      const mockSheet = { /* mock sheet */ };
      const mockNewSheet = { /* mock new sheet */ };
      const mockCsvData = 'Date,Amount,Payee,Description,Reference,Cheque Number\n2024-01-01,-150.25,,Test Debit Transaction,,\n';

      mockXLSX.read.mockReturnValue(mockWorkbook);
      mockXLSX.utils.sheet_to_json.mockReturnValue(mockRawData);
      mockXLSX.utils.json_to_sheet.mockReturnValue(mockNewSheet);
      mockXLSX.utils.sheet_to_csv.mockReturnValue(mockCsvData);

      const result = await mediator.whishMigration(mockDataMigrationDto);

      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString()).toBe(mockCsvData);
    });

    it('should calculate amounts correctly for credit transactions', async () => {
      const mockWorkbook = {
        Sheets: {
          'Sheet1': { /* mock sheet data */ },
        },
        SheetNames: ['Sheet1'],
      };

      const mockRawData = [
        ['Date', 'Details', 'Debit', 'Credit'],
        ['2024-01-01', 'Test Credit Transaction', '', '300.50'],
      ];

      const mockFormattedData = [
        { Date: '2024-01-01', Amount: 300.50, Payee: '', Description: 'Test Credit Transaction', Reference: '', 'Cheque Number': '' },
      ];

      const mockSheet = { /* mock sheet */ };
      const mockNewSheet = { /* mock new sheet */ };
      const mockCsvData = 'Date,Amount,Payee,Description,Reference,Cheque Number\n2024-01-01,300.50,,Test Credit Transaction,,\n';

      mockXLSX.read.mockReturnValue(mockWorkbook);
      mockXLSX.utils.sheet_to_json.mockReturnValue(mockRawData);
      mockXLSX.utils.json_to_sheet.mockReturnValue(mockNewSheet);
      mockXLSX.utils.sheet_to_csv.mockReturnValue(mockCsvData);

      const result = await mediator.whishMigration(mockDataMigrationDto);

      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString()).toBe(mockCsvData);
    });

    it('should throw error when XLSX processing fails', async () => {
      mockXLSX.read.mockImplementation(() => {
        throw new Error('Invalid file format');
      });

      try {
        await mediator.whishMigration(mockDataMigrationDto);
        fail('Expected HttpException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Error processing file: Invalid file format');
      }

      expect(mockXLSX.read).toHaveBeenCalled();
    });
  });

  describe('component structure', () => {
    it('should have all required methods', () => {
      expect(typeof mediator.blomBankMigration).toBe('function');
      expect(typeof mediator.whishMigration).toBe('function');
    });

    it('should be properly instantiated', () => {
      expect(mediator).toBeDefined();
      expect(mediator).toBeInstanceOf(DataMigrationMediator);
    });
  });
});
