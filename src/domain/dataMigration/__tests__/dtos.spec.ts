import { validate } from 'class-validator';
import { DataMigrationDto } from '../dtos/data.migration.dto';

describe('DataMigration DTOs', () => {
  describe('DataMigrationDto', () => {
    it('should validate valid data with all fields', async () => {
      const dto = new DataMigrationDto();
      dto.sourceFilePath = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,UEsDBBQAAAAIAA...';
      dto.targetFilePath = '/path/to/target/file.xlsx';
      dto.category = 'blom_bank';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate valid data with only sourceFilePath', async () => {
      const dto = new DataMigrationDto();
      dto.sourceFilePath = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,UEsDBBQAAAAIAA...';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate valid data with only targetFilePath', async () => {
      const dto = new DataMigrationDto();
      dto.targetFilePath = '/path/to/target/file.xlsx';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate valid data with only category', async () => {
      const dto = new DataMigrationDto();
      dto.category = 'whish';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate empty data (all fields optional)', async () => {
      const dto = new DataMigrationDto();

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with valid base64 data URL', async () => {
      const dto = new DataMigrationDto();
      dto.sourceFilePath = 'data:text/csv;base64,UEsDBBQAAAAIAA...';
      dto.category = 'blom_bank';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with valid category values', async () => {
      const validCategories = ['blom_bank', 'whish'];
      
      for (const category of validCategories) {
        const dto = new DataMigrationDto();
        dto.category = category;

        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });

    it('should validate with long file paths', async () => {
      const dto = new DataMigrationDto();
      dto.sourceFilePath = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + 'A'.repeat(1000);
      dto.targetFilePath = '/very/long/path/to/file/with/many/subdirectories/and/a/very/long/filename.xlsx';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with special characters in file paths', async () => {
      const dto = new DataMigrationDto();
      dto.sourceFilePath = 'data:text/csv;base64,UEsDBBQAAAAIAA...';
      dto.targetFilePath = '/path/with/spaces and-special_chars/file.xlsx';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with numeric strings (should be treated as valid)', async () => {
      const dto = new DataMigrationDto();
      dto.sourceFilePath = 'data:text/csv;base64,UEsDBBQAAAAIAA...';
      dto.targetFilePath = '123';
      dto.category = '123';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with empty strings (should be treated as valid)', async () => {
      const dto = new DataMigrationDto();
      dto.sourceFilePath = '';
      dto.targetFilePath = '';
      dto.category = '';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with null values (should be treated as valid)', async () => {
      const dto = new DataMigrationDto();
      dto.sourceFilePath = null as any;
      dto.targetFilePath = null as any;
      dto.category = null as any;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with undefined values (should be treated as valid)', async () => {
      const dto = new DataMigrationDto();
      dto.sourceFilePath = undefined as any;
      dto.targetFilePath = undefined as any;
      dto.category = undefined as any;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });
});
