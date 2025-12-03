import { PlayerEntity, GAME_SETTINGS } from '@goalxi/database';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class GeneratePlayersSeeder implements Seeder {
    track = false;

    public async run(dataSource: DataSource): Promise<any> {
        const repository = dataSource.getRepository(PlayerEntity);

        const firstNames = [
            'Marcus', 'Leo', 'Diego', 'Carlos', 'Andre', 'Paulo', 'Roberto',
            'Fernando', 'Luis', 'Miguel', 'Rafael', 'Gabriel', 'Juan', 'Pedro',
            'Antonio', 'Manuel', 'Jose', 'David', 'Daniel', 'Alex',
        ];

        const lastNames = [
            'Silva', 'Santos', 'Rodriguez', 'Martinez', 'Garcia', 'Lopez',
            'Gonzalez', 'Perez', 'Sanchez', 'Ramirez', 'Torres', 'Flores',
            'Rivera', 'Gomez', 'Diaz', 'Cruz', 'Morales', 'Reyes', 'Ortiz', 'Gutierrez',
        ];

        const count = 20; // Generate 20 random players

        for (let i = 0; i < count; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const isGoalkeeper = Math.random() < 0.1; // 10% chance to be a GK
            const [currentSkills, potentialSkills] = this.generateRandomSkills(isGoalkeeper);

            const age = Math.floor(Math.random() * (35 - 17 + 1)) + 17; // Random age 17-35
            // Add random offset within the year so they aren't all born exactly on the season boundary
            const randomDaysOffset = Math.floor(Math.random() * GAME_SETTINGS.DAYS_PER_YEAR);
            const birthday = new Date(Date.now() - (age * GAME_SETTINGS.MS_PER_YEAR) - (randomDaysOffset * 24 * 60 * 60 * 1000));

            const player = new PlayerEntity({
                name: `${firstName} ${lastName}`,
                isGoalkeeper,
                birthday,
                isYouth: age <= 18,
                appearance: this.generateRandomAppearance(),
                currentSkills,
                potentialSkills,
            });

            await repository.save(player);
        }

        console.log(`Generated ${count} random players`);
    }

    private generateRandomAppearance(): Record<string, any> {
        const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

        return {
            skinTone: randInt(1, 6),
            hairStyle: randInt(1, 10),
            hairColor: randInt(1, 8),
            facialHair: randInt(0, 5),
            accessories: {
                headband: Math.random() < 0.15,
                wristband: Math.random() < 0.3,
                captainBand: Math.random() < 0.05,
            },
        };
    }

    private generateRandomSkills(isGoalkeeper: boolean): [any, any] {
        const rand = (min: number, max: number) => Number((Math.random() * (max - min) + min).toFixed(2));

        const createPhysical = () => ({
            pace: rand(isGoalkeeper ? 5 : 10, 20),
            strength: rand(5, 20),
        });

        const createTechnicalGK = () => ({
            reflexes: rand(10, 20),
            handling: rand(10, 20),
            distribution: rand(5, 18),
        });

        const createTechnicalOutfield = () => ({
            finishing: rand(5, 20),
            passing: rand(5, 20),
            dribbling: rand(5, 20),
            defending: rand(5, 20),
        });

        const createMental = () => ({
            vision: rand(5, 20),
            positioning: rand(5, 20),
            awareness: rand(5, 20),
            composure: rand(5, 20),
            aggression: rand(5, 20),
        });

        const currentPhysical = createPhysical();
        const currentTechnical = isGoalkeeper ? createTechnicalGK() : createTechnicalOutfield();
        const currentMental = createMental();

        const currentSkills = {
            physical: currentPhysical,
            technical: currentTechnical,
            mental: currentMental,
        };

        // For simplicity in this seeder, potential is just slightly higher than current
        const potentialSkills = {
            physical: { ...currentPhysical },
            technical: { ...currentTechnical },
            mental: { ...currentMental },
        };

        return [currentSkills, potentialSkills];
    }
}
