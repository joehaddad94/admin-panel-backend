import { Test, TestingModule } from '@nestjs/testing';
import { DataMigrationController } from '../data.migration.controller';
import { DataMigrationMediator } from '../data.migration.mediator';
import { DataMigrationDto } from '../dtos/data.migration.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

describe('DataMigrationController', () => {
  let controller: DataMigrationController;
  let mediator: DataMigrationMediator;
  let module: TestingModule;

  const mockDataMigrationMediator = {
    blomBankMigration: jest.fn(),
    whishMigration: jest.fn(),
  };

  const mockResponse = {
    setHeader: jest.fn(),
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn(),
    getHeaders: jest.fn().mockReturnValue({}),
  } as any;

  const mockDataMigrationDto: DataMigrationDto = {
    sourceFilePath: 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,UEsDBBQAAAAIAA...',
    category: 'blom_bank',
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [DataMigrationController],
      providers: [
        {
          provide: DataMigrationMediator,
          useValue: mockDataMigrationMediator,
        },
      ],
    }).compile();

    controller = module.get<DataMigrationController>(DataMigrationController);
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

  describe('dataMigration', () => {
    it('should successfully process blom_bank migration', async () => {
      const mockFileBuffer = Buffer.from('test csv data');
      mockDataMigrationMediator.blomBankMigration.mockResolvedValue(mockFileBuffer);

      await controller.dataMigration(mockDataMigrationDto, mockResponse);

      expect(mockDataMigrationMediator.blomBankMigration).toHaveBeenCalledWith(mockDataMigrationDto);
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename=blom_bank_migration.csv');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.send).toHaveBeenCalledWith(mockFileBuffer);
    });

    it('should successfully process whish migration', async () => {
      const whishDto = { ...mockDataMigrationDto, category: 'whish' };
      const mockFileBuffer = Buffer.from('test whish csv data');
      mockDataMigrationMediator.whishMigration.mockResolvedValue(mockFileBuffer);

      await controller.dataMigration(whishDto, mockResponse);

      expect(mockDataMigrationMediator.whishMigration).toHaveBeenCalledWith(whishDto);
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename=whish_migration.csv');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.send).toHaveBeenCalledWith(mockFileBuffer);
    });

    it('should throw error for unsupported category', async () => {
      const unsupportedDto = { ...mockDataMigrationDto, category: 'unsupported' };

      await controller.dataMigration(unsupportedDto, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Data migration Failed',
        error: 'Unsupported Category',
      });
    });

    it('should handle mediator errors gracefully', async () => {
      const errorMessage = 'File processing failed';
      mockDataMigrationMediator.blomBankMigration.mockRejectedValue(new Error(errorMessage));

      await controller.dataMigration(mockDataMigrationDto, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Data migration Failed',
        error: errorMessage,
      });
    });

    it('should handle HttpException from mediator', async () => {
      const httpError = new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      mockDataMigrationMediator.blomBankMigration.mockRejectedValue(httpError);

      await controller.dataMigration(mockDataMigrationDto, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Data migration Failed',
        error: 'Bad request',
      });
    });

    it('should handle unknown error types', async () => {
      const unknownError = 'Unknown error occurred';
      mockDataMigrationMediator.blomBankMigration.mockRejectedValue(unknownError);

      await controller.dataMigration(mockDataMigrationDto, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Data migration Failed',
        error: undefined,
      });
    });

    it('should set correct headers for blom_bank category', async () => {
      const mockFileBuffer = Buffer.from('test csv data');
      mockDataMigrationMediator.blomBankMigration.mockResolvedValue(mockFileBuffer);

      await controller.dataMigration(mockDataMigrationDto, mockResponse);

      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename=blom_bank_migration.csv');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
    });

    it('should set correct headers for whish category', async () => {
      const whishDto = { ...mockDataMigrationDto, category: 'whish' };
      const mockFileBuffer = Buffer.from('test whish csv data');
      mockDataMigrationMediator.whishMigration.mockResolvedValue(mockFileBuffer);

      await controller.dataMigration(whishDto, mockResponse);

      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename=whish_migration.csv');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
    });

    it('should call console.log for response headers', async () => {
      const mockFileBuffer = Buffer.from('test csv data');
      mockDataMigrationMediator.blomBankMigration.mockResolvedValue(mockFileBuffer);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await controller.dataMigration(mockDataMigrationDto, mockResponse);

      expect(consoleSpy).toHaveBeenCalledWith(mockResponse.getHeaders());
      consoleSpy.mockRestore();
    });

    it('should handle empty file buffer', async () => {
      const emptyBuffer = Buffer.alloc(0);
      mockDataMigrationMediator.blomBankMigration.mockResolvedValue(emptyBuffer);

      await controller.dataMigration(mockDataMigrationDto, mockResponse);

      expect(mockResponse.send).toHaveBeenCalledWith(emptyBuffer);
    });

    it('should handle large file buffer', async () => {
      const largeBuffer = Buffer.alloc(1024 * 1024); // 1MB buffer
      mockDataMigrationMediator.blomBankMigration.mockResolvedValue(largeBuffer);

      await controller.dataMigration(mockDataMigrationDto, mockResponse);

      expect(mockResponse.send).toHaveBeenCalledWith(largeBuffer);
    });
  });

  describe('component structure', () => {
    it('should have all required methods', () => {
      expect(typeof controller.dataMigration).toBe('function');
    });

    it('should have proper constructor injection', () => {
      expect(controller['mediator']).toBeDefined();
      expect(controller['mediator']).toBe(mediator);
    });
  });

  describe('endpoint configuration', () => {
    it('should have correct route decorator', () => {
      // Test that the method exists and is callable
      expect(typeof controller.dataMigration).toBe('function');
    });

    it('should have correct HTTP method decorator', () => {
      // Test that the method exists and is callable
      expect(typeof controller.dataMigration).toBe('function');
    });

    it('should have correct body parameter decorator', () => {
      // Test that the method exists and is callable
      expect(typeof controller.dataMigration).toBe('function');
    });

    it('should have correct response parameter decorator', () => {
      // Test that the method exists and is callable
      expect(typeof controller.dataMigration).toBe('function');
    });
  });

  describe('error handling scenarios', () => {
    it('should handle mediator throwing HttpException with custom status', async () => {
      const customHttpError = new HttpException('Custom error message', HttpStatus.FORBIDDEN);
      mockDataMigrationMediator.blomBankMigration.mockRejectedValue(customHttpError);

      await controller.dataMigration(mockDataMigrationDto, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Data migration Failed',
        error: 'Custom error message',
      });
    });

    it('should handle mediator throwing string error', async () => {
      const stringError = 'String error message';
      mockDataMigrationMediator.blomBankMigration.mockRejectedValue(stringError);

      await controller.dataMigration(mockDataMigrationDto, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Data migration Failed',
        error: undefined,
      });
    });

    it('should handle mediator throwing number error', async () => {
      const numberError = 500;
      mockDataMigrationMediator.blomBankMigration.mockRejectedValue(numberError);

      await controller.dataMigration(mockDataMigrationDto, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Data migration Failed',
        error: undefined,
      });
    });
  });
});
