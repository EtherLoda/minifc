import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTeamIdToPlayer1732691000000 implements MigrationInterface {
    name = 'AddTeamIdToPlayer1732691000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      ALTER TABLE "player"
      ADD COLUMN "team_id" uuid
    `);

        await queryRunner.query(`
      ALTER TABLE "player"
      ADD CONSTRAINT "FK_player_team"
      FOREIGN KEY ("team_id")
      REFERENCES "team"("id")
      ON DELETE SET NULL
    `);

        await queryRunner.query(`
      CREATE INDEX "IDX_player_team" ON "player" ("team_id")
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_player_team"`);
        await queryRunner.query(`ALTER TABLE "player" DROP CONSTRAINT "FK_player_team"`);
        await queryRunner.query(`ALTER TABLE "player" DROP COLUMN "team_id"`);
    }
}
