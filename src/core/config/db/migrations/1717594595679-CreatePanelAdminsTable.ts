import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class PanelAdmins1717594595679 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'panel_admins',
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'name',
          type: 'varchar',
          length: '255',
        },
        {
          name: 'email',
          type: 'varchar',
          length: '255',
          isUnique: true,
        },
        {
          name: 'password',
          type: 'varchar',
          length: '255',
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'CURRENT_TIMESTAMP',
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          default: 'CURRENT_TIMESTAMP',
          onUpdate: 'CURRENT_TIMESTAMP',
        },
        {
          name: 'isActive',
          type: 'boolean',
        },
        {
          name: 'reset_token',
          type: 'varchar',
          length: '255',
          isNullable: true,
        },
        {
          name: 'reset_token_expiry',
          type: 'timestamp',
          isNullable: true,
        },
        {
          name: 'login_attempts',
          type: 'int',
          default: 0,
        },
      ],
    });
    await queryRunner.createTable(table);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('panel_admins');
  }
}
