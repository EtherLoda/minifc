import 'reflect-metadata';
import { AppDataSource } from '../src/database/data-source';
import { PlayerEntity } from '@goalxi/database';

async function clearPlayers() {
    try {
        console.log('🚀 Connecting to database...');
        await AppDataSource.initialize();
        console.log('✅ Connected\n');

        console.log('🗑️  Deleting all players...');
        const result = await AppDataSource
            .createQueryBuilder()
            .delete()
            .from(PlayerEntity)
            .execute();
        console.log(`✅ Deleted ${result.affected || 0} players\n`);

        await AppDataSource.destroy();
        console.log('✅ Done!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

clearPlayers();
