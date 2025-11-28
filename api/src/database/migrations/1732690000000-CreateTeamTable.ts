import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTeamTable1732690000000 implements MigrationInterface {
    name = 'CreateTeamTable1732690000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      CREATE TABLE "team" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "league_id" uuid,
        "name" character varying NOT NULL,
        "logo_url" character varying NOT NULL DEFAULT '',
        "jersey_color_primary" character varying NOT NULL DEFAULT '#FF0000',
        "jersey_color_secondary" character varying NOT NULL DEFAULT '#FFFFFF',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_team_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_team_user_id" UNIQUE ("user_id"),
        CONSTRAINT "FK_team_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_team_league" FOREIGN KEY ("league_id") REFERENCES "league"("id") ON DELETE SET NULL
      )
    `);

        await queryRunner.query(`
      CREATE INDEX "IDX_team_league" ON "team" ("league_id")
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_team_league"`);
        await queryRunner.query(`DROP TABLE "team"`);
    }
}
