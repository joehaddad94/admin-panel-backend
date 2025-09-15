import { validate } from 'class-validator';
import { CreateEditDecisionDateDto } from '../dtos/create-dates.dto';

describe('DecisionDate DTOs', () => {
  describe('CreateEditDecisionDateDto', () => {
    it('should validate valid data with all fields', async () => {
      const dto = new CreateEditDecisionDateDto();
      dto.cycleId = 1;
      dto.dateTime1 = new Date('2024-01-01T10:00:00Z');
      dto.link1 = 'https://example.com/link1';
      dto.link2 = 'https://example.com/link2';
      dto.link3 = 'https://example.com/link3';
      dto.link4 = 'https://example.com/link4';
      dto.date1 = new Date('2024-01-01');
      dto.date2 = new Date('2024-01-02');
      dto.decisionDateId = 123;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate valid data with only required fields', async () => {
      const dto = new CreateEditDecisionDateDto();
      dto.cycleId = 1;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with valid dates', async () => {
      const dto = new CreateEditDecisionDateDto();
      dto.cycleId = 1;
      dto.dateTime1 = new Date('2024-01-01T10:00:00Z');
      dto.date1 = new Date('2024-01-01');
      dto.date2 = new Date('2024-01-02');

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with valid links', async () => {
      const dto = new CreateEditDecisionDateDto();
      dto.cycleId = 1;
      dto.link1 = 'https://example.com/link1';
      dto.link2 = 'http://example.com/link2';
      dto.link3 = 'ftp://example.com/link3';
      dto.link4 = 'https://example.com/link4';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with numeric decisionDateId', async () => {
      const dto = new CreateEditDecisionDateDto();
      dto.cycleId = 1;
      dto.decisionDateId = 123;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when cycleId is missing', async () => {
      const dto = new CreateEditDecisionDateDto();
      dto.dateTime1 = new Date('2024-01-01T10:00:00Z');

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isNotEmpty).toBe('cycleId must be provided');
    });

    it('should fail validation when cycleId is null', async () => {
      const dto = new CreateEditDecisionDateDto();
      (dto as any).cycleId = null;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isNotEmpty).toBe('cycleId must be provided');
    });

    it('should fail validation when cycleId is undefined', async () => {
      const dto = new CreateEditDecisionDateDto();
      (dto as any).cycleId = undefined;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isNotEmpty).toBe('cycleId must be provided');
    });

    it('should fail validation when decisionDateId is not a number', async () => {
      const dto = new CreateEditDecisionDateDto();
      dto.cycleId = 1;
      (dto as any).decisionDateId = 'not-a-number';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isNumber).toBe('decisionDateId must be a number conforming to the specified constraints');
    });

    it('should validate with empty strings for links (should be treated as valid)', async () => {
      const dto = new CreateEditDecisionDateDto();
      dto.cycleId = 1;
      dto.link1 = '';
      dto.link2 = '';
      dto.link3 = '';
      dto.link4 = '';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with null values for optional fields (should be treated as valid)', async () => {
      const dto = new CreateEditDecisionDateDto();
      dto.cycleId = 1;
      (dto as any).dateTime1 = null;
      (dto as any).link1 = null;
      (dto as any).date1 = null;
      (dto as any).decisionDateId = null;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with undefined values for optional fields (should be treated as valid)', async () => {
      const dto = new CreateEditDecisionDateDto();
      dto.cycleId = 1;
      (dto as any).dateTime1 = undefined;
      (dto as any).link1 = undefined;
      (dto as any).date1 = undefined;
      (dto as any).decisionDateId = undefined;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with zero cycleId (should be treated as valid)', async () => {
      const dto = new CreateEditDecisionDateDto();
      dto.cycleId = 0;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with negative cycleId (should be treated as valid)', async () => {
      const dto = new CreateEditDecisionDateDto();
      dto.cycleId = -1;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with zero decisionDateId (should be treated as valid)', async () => {
      const dto = new CreateEditDecisionDateDto();
      dto.cycleId = 1;
      dto.decisionDateId = 0;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with negative decisionDateId (should be treated as valid)', async () => {
      const dto = new CreateEditDecisionDateDto();
      dto.cycleId = 1;
      dto.decisionDateId = -1;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });
});
