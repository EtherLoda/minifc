import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMatchLifecycleFields1735296900000 implements MigrationInterface {
    name = 'AddMatchLifecycleFields1735296900000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add new fields to match table
        await queryRunner.query(`ALTER TABLE "match" ADD "tactics_locked_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "match" ADD "actual_end_time" TIMESTAMP`);
        
        // Add new fields to match_event table
        await queryRunner.query(`ALTER TABLE "match_event" ADD "event_scheduled_time" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "match_event" ADD "is_revealed" boolean NOT NULL DEFAULT false`);
        
        // Add index for event_scheduled_time for better query performance
        await queryRunner.query(`CREATE INDEX "IDX_match_event_scheduled_time" ON "match_event" ("match_id", "event_scheduled_time")`);
        
        // Add comment to actual_end_time column
        await queryRunner.query(`COMMENT ON COLUMN "match"."actual_end_time" IS 'Calculated as scheduledAt + match duration (45 + 15 halftime + 45 + injury time)'`);
        await queryRunner.query(`COMMENT ON COLUMN "match_event"."event_scheduled_time" IS 'Real-world time when this event should be revealed'`);
        await queryRunner.query(`COMMENT ON COLUMN "match_event"."is_revealed" IS 'Whether this event has passed its scheduled time'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove index
        await queryRunner.query(`DROP INDEX "IDX_match_event_scheduled_time"`);
        
        // Remove fields from match_event table
        await queryRunner.query(`ALTER TABLE "match_event" DROP COLUMN "is_revealed"`);
        await queryRunner.query(`ALTER TABLE "match_event" DROP COLUMN "event_scheduled_time"`);
        
        // Remove fields from match table
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "actual_end_time"`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "tactics_locked_at"`);
    }

}
