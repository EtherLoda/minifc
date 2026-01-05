import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddNationality1736070000000 implements MigrationInterface {
    name = 'AddNationality1736070000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add nationality column to player table
        await queryRunner.addColumn(
            'player',
            new TableColumn({
                name: 'nationality',
                type: 'varchar',
                length: '2',
                isNullable: true,
                comment: 'ISO 3166-1 alpha-2 country code (e.g., CN, US, GB, DE)',
            }),
        );

        // Add nationality column to team table
        await queryRunner.addColumn(
            'team',
            new TableColumn({
                name: 'nationality',
                type: 'varchar',
                length: '2',
                isNullable: true,
                comment: 'ISO 3166-1 alpha-2 country code (e.g., CN, US, GB, DE)',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('player', 'nationality');
        await queryRunner.dropColumn('team', 'nationality');
    }
}
