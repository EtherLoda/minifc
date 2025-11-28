import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReplaceAvatarWithAppearance1732692000000 implements MigrationInterface {
    name = 'ReplaceAvatarWithAppearance1732692000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop the avatar column
        await queryRunner.query(`
      ALTER TABLE "player"
      DROP COLUMN "avatar"
    `);

        // Add the appearance column
        await queryRunner.query(`
      ALTER TABLE "player"
      ADD COLUMN "appearance" jsonb NOT NULL DEFAULT '{}'
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the appearance column
        await queryRunner.query(`
      ALTER TABLE "player"
      DROP COLUMN "appearance"
    `);

        // Re-add the avatar column
        await queryRunner.query(`
      ALTER TABLE "player"
      ADD COLUMN "avatar" character varying NOT NULL DEFAULT ''
    `);
    }
}
