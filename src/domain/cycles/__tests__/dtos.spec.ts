import { validate } from 'class-validator';
import { CreateEditCycleDto } from '../dtos/create.cycle.dto';

describe('Cycle DTOs', () => {
  describe('CreateEditCycleDto', () => {
    it('should validate valid data with all fields', async () => {
      const validData = {
        programId: 1,
        cycleId: 2,
        cycleName: 'Test Cycle',
        fromDate: new Date('2024-01-01'),
        toDate: new Date('2024-12-31'),
      };

      const dto = Object.assign(new CreateEditCycleDto(), validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate valid data with only required fields', async () => {
      const validData = {
        programId: 1,
      };

      const dto = Object.assign(new CreateEditCycleDto(), validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate empty data (all fields optional)', async () => {
      const emptyData = {};

      const dto = Object.assign(new CreateEditCycleDto(), emptyData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate with only programId', async () => {
      const validData = {
        programId: 1,
      };

      const dto = Object.assign(new CreateEditCycleDto(), validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate with only cycleId', async () => {
      const validData = {
        cycleId: 2,
      };

      const dto = Object.assign(new CreateEditCycleDto(), validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate with only cycleName', async () => {
      const validData = {
        cycleName: 'Test Cycle',
      };

      const dto = Object.assign(new CreateEditCycleDto(), validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate with only fromDate', async () => {
      const validData = {
        fromDate: new Date('2024-01-01'),
      };

      const dto = Object.assign(new CreateEditCycleDto(), validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate with only toDate', async () => {
      const validData = {
        toDate: new Date('2024-12-31'),
      };

      const dto = Object.assign(new CreateEditCycleDto(), validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate with partial data', async () => {
      const partialData = {
        programId: 1,
        cycleName: 'Test Cycle',
      };

      const dto = Object.assign(new CreateEditCycleDto(), partialData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate with string programId', async () => {
      const validData = {
        programId: '1' as any, // String that can be converted to number
      };

      const dto = Object.assign(new CreateEditCycleDto(), validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('programId');
    });

    it('should validate with string cycleId', async () => {
      const validData = {
        cycleId: '2' as any, // String that can be converted to number
      };

      const dto = Object.assign(new CreateEditCycleDto(), validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('cycleId');
    });

    it('should validate with numeric string cycleName', async () => {
      const validData = {
        cycleName: '123',
      };

      const dto = Object.assign(new CreateEditCycleDto(), validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate with special characters in cycleName', async () => {
      const validData = {
        cycleName: 'Test-Cycle_2024!',
      };

      const dto = Object.assign(new CreateEditCycleDto(), validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate with future dates', async () => {
      const validData = {
        fromDate: new Date('2025-01-01'),
        toDate: new Date('2025-12-31'),
      };

      const dto = Object.assign(new CreateEditCycleDto(), validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate with past dates', async () => {
      const validData = {
        fromDate: new Date('2023-01-01'),
        toDate: new Date('2023-12-31'),
      };

      const dto = Object.assign(new CreateEditCycleDto(), validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate with same fromDate and toDate', async () => {
      const validData = {
        fromDate: new Date('2024-06-01'),
        toDate: new Date('2024-06-01'),
      };

      const dto = Object.assign(new CreateEditCycleDto(), validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate with zero programId', async () => {
      const validData = {
        programId: 0,
      };

      const dto = Object.assign(new CreateEditCycleDto(), validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate with zero cycleId', async () => {
      const validData = {
        cycleId: 0,
      };

      const dto = Object.assign(new CreateEditCycleDto(), validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate with negative programId', async () => {
      const validData = {
        programId: -1,
      };

      const dto = Object.assign(new CreateEditCycleDto(), validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate with negative cycleId', async () => {
      const validData = {
        cycleId: -1,
      };

      const dto = Object.assign(new CreateEditCycleDto(), validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });
  });
});
