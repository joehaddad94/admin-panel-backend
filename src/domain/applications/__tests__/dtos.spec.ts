import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { SendingEmailsDto } from '../dtos/sending.emails.dto';
import { ExamScoresDto } from '../dtos/exam.scores.dto';
import { InterviewScoresDto } from '../dtos/interview.scores.dto';
import { ApplyToFSEDto } from '../dtos/apply.fse.dto';
import { ImportDataDto } from '../dtos/Import.data.dto';

describe('Application DTOs', () => {
  describe('SendingEmailsDto', () => {
    it('should validate valid data', async () => {
      const validData = {
        cycleId: 1,
        emails: [
          { ids: 1, emails: 'test@example.com' },
        ],
      };

      const dto = plainToClass(SendingEmailsDto, validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should require cycleId', async () => {
      const invalidData = {
        emails: [
          { ids: 1, emails: 'test@example.com' },
        ],
      };

      const dto = plainToClass(SendingEmailsDto, invalidData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isNotEmpty).toBeDefined();
    });

    it('should require emails array', async () => {
      const invalidData = {
        cycleId: 1,
      };

      const dto = plainToClass(SendingEmailsDto, invalidData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isArray).toBeDefined();
    });

    it('should validate email entries', async () => {
      const invalidData = {
        cycleId: 1,
        emails: [
          { ids: 'invalid', emails: 'invalid-email' },
        ],
      };

      const dto = plainToClass(SendingEmailsDto, invalidData);
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
    });

    it('should accept optional fields', async () => {
      const validData = {
        cycleId: 1,
        emails: [
          { ids: 1, emails: 'test@example.com' },
        ],
        attachmentUrl: 'https://example.com/file.pdf',
        submissionUrl: 'https://example.com/submit',
        interviewDateTime: '2024-01-01T10:00:00Z',
        orientationInfo: 'Orientation details',
        submissionDateTime: '2024-01-01T23:59:59Z',
      };

      const dto = plainToClass(SendingEmailsDto, validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate URL format for attachmentUrl', async () => {
      const invalidData = {
        cycleId: 1,
        emails: [
          { ids: 1, emails: 'test@example.com' },
        ],
        attachmentUrl: 'invalid-url',
      };

      const dto = plainToClass(SendingEmailsDto, invalidData);
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
    });

    it('should validate URL format for submissionUrl', async () => {
      const invalidData = {
        cycleId: 1,
        emails: [
          { ids: 1, emails: 'test@example.com' },
        ],
        submissionUrl: 'invalid-url',
      };

      const dto = plainToClass(SendingEmailsDto, invalidData);
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
    });

    it('should validate date format for interviewDateTime', async () => {
      const invalidData = {
        cycleId: 1,
        emails: [
          { ids: 1, emails: 'test@example.com' },
        ],
        interviewDateTime: 'invalid-date',
      };

      const dto = plainToClass(SendingEmailsDto, invalidData);
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
    });

    it('should validate date format for submissionDateTime', async () => {
      const invalidData = {
        cycleId: 1,
        emails: [
          { ids: 1, emails: 'test@example.com' },
        ],
        submissionDateTime: 'invalid-date',
      };

      const dto = plainToClass(SendingEmailsDto, invalidData);
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('ExamScoresDto', () => {
    it('should validate valid data', async () => {
      const validData = {
        cycleId: 1,
        examScores: [
          { email: 'test@example.com', score: 85 },
        ],
      };

      const dto = plainToClass(ExamScoresDto, validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should require cycleId', async () => {
      const invalidData = {
        examScores: [
          { email: 'test@example.com', score: 85 },
        ],
      };

      const dto = plainToClass(ExamScoresDto, invalidData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isNotEmpty).toBeDefined();
    });

    it('should require examScores array', async () => {
      const invalidData = {
        cycleId: 1,
      };

      const dto = plainToClass(ExamScoresDto, invalidData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.arrayMinSize).toBeDefined();
    });
  });

  describe('InterviewScoresDto', () => {
    it('should validate valid data', async () => {
      const validData = {
        cycleId: 1,
        interviewScores: [
          { 
            email: 'test@example.com', 
            techScore: 90, 
            softScore: 85, 
            remarks: 'Good candidate' 
          },
        ],
      };

      const dto = plainToClass(InterviewScoresDto, validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should require cycleId', async () => {
      const invalidData = {
        interviewScores: [
          { 
            email: 'test@example.com', 
            techScore: 90, 
            softScore: 85, 
            remarks: 'Good candidate' 
          },
        ],
      };

      const dto = plainToClass(InterviewScoresDto, invalidData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isNotEmpty).toBeDefined();
    });

    it('should require interviewScores array', async () => {
      const invalidData = {
        cycleId: 1,
      };

      const dto = plainToClass(InterviewScoresDto, invalidData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.arrayMinSize).toBeDefined();
    });
  });

  describe('ApplyToFSEDto', () => {
    it('should validate valid data', async () => {
      const validData = {
        selectedApplicationsIds: [
          { userId: 1, infoId: 1 },
        ],
        targetedFSECycleId: 1,
      };

      const dto = plainToClass(ApplyToFSEDto, validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should require selectedApplicationsIds', async () => {
      const invalidData = {
        targetedFSECycleId: 1,
      };

      const dto = plainToClass(ApplyToFSEDto, invalidData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isNotEmpty).toBeDefined();
    });

    it('should require selectedApplicationsIds to be an array', async () => {
      const invalidData = {
        selectedApplicationsIds: 'not-an-array',
        targetedFSECycleId: 1,
      };

      const dto = plainToClass(ApplyToFSEDto, invalidData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isArray).toBeDefined();
    });

    it('should accept null targetedFSECycleId', async () => {
      const validData = {
        selectedApplicationsIds: [
          { userId: 1, infoId: 1 },
        ],
        targetedFSECycleId: null,
      };

      const dto = plainToClass(ApplyToFSEDto, validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });
  });

  describe('ImportDataDto', () => {
    it('should validate valid data', async () => {
      const validData = {
        cycleId: 1,
        importType: 'applications',
        data: [{ email: 'test@example.com', name: 'Test User' }],
      };

      const dto = plainToClass(ImportDataDto, validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should require cycleId', async () => {
      const invalidData = {
        importType: 'applications',
        data: [{ email: 'test@example.com', name: 'Test User' }],
      };

      const dto = plainToClass(ImportDataDto, invalidData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isNotEmpty).toBeDefined();
    });

    it('should require importType', async () => {
      const invalidData = {
        cycleId: 1,
        data: [{ email: 'test@example.com', name: 'Test User' }],
      };

      const dto = plainToClass(ImportDataDto, invalidData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isNotEmpty).toBeDefined();
    });

    it('should require data array', async () => {
      const invalidData = {
        cycleId: 1,
        importType: 'applications',
      };

      const dto = plainToClass(ImportDataDto, invalidData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isArray).toBeDefined();
    });
  });
});
