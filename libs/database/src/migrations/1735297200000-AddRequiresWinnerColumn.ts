import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRequiresWinnerColumn1735297200000 implements MigrationInterface {
    name = 'AddRequiresWinnerColumn1735297200000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add requires_winner column to match table
        await queryRunner.query(`ALTER TABLE "match" ADD "requires_winner" boolean NOT NULL DEFAULT false`);
        
        // Add comment
        await queryRunner.query(`COMMENT ON COLUMN "match"."requires_winner" IS 'Whether this match requires a winner (cup/knockout matches). If true and match is tied after 90 minutes, extra time will be played.'`);
        
        // Set requires_winner = true for all CUP and TOURNAMENT matches
        await queryRunner.query(`UPDATE "match" SET "requires_winner" = true WHERE "type" IN ('cup', 'tournament')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove requires_winner column
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "requires_winner"`);
    }

}
