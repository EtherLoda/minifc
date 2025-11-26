import { Player, PlayerAppearance, Position, SkinTone, HairStyle, BodyType, Accessory } from '@/types/player';

const skinTones: SkinTone[] = ['#F4C2A5', '#E0AC69', '#C68642', '#8D5524', '#5C3317'];
const hairColors = ['#2C1810', '#8B4513', '#D2691E', '#FFD700', '#FF6B35', '#000000', '#FFFFFF'];
const hairStyles: HairStyle[] = ['buzz', 'short', 'messy', 'spiky', 'mohawk', 'afro'];
const bodyTypes: BodyType[] = ['thin', 'normal'];
const accessories: Accessory[] = ['none', 'glasses', 'bandana'];
const jerseyColors = ['#FF4444', '#4444FF', '#44FF44', '#FF8C00', '#9333EA', '#EC4899', '#14B8A6'];

const firstNames = [
    'Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery',
    'Quinn', 'Reese', 'Blake', 'Drew', 'Skyler', 'Rowan', 'Phoenix', 'River'
];

const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Martinez',
    'Rodriguez', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson'
];

function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomStat(): number {
    return Math.floor(Math.random() * 40) + 60; // 60-99
}

export function generateRandomAppearance(): PlayerAppearance {
    return {
        skinTone: getRandomElement(skinTones),
        hairColor: getRandomElement(hairColors),
        hairStyle: getRandomElement(hairStyles),
        bodyType: getRandomElement(bodyTypes),
        jerseyColorPrimary: getRandomElement(jerseyColors),
        jerseyColorSecondary: getRandomElement(jerseyColors),
        accessory: getRandomElement(accessories),
    };
}

export function generateRandomPlayer(position?: Position): Player {
    const positions: Position[] = ['GK', 'DEF', 'MID', 'FWD'];
    const selectedPosition = position || getRandomElement(positions);

    return {
        id: `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`,
        position: selectedPosition,
        appearance: generateRandomAppearance(),
        stats: {
            speed: getRandomStat(),
            power: getRandomStat(),
            skill: getRandomStat(),
        },
    };
}

export function generateTeam(size: number = 11): Player[] {
    const team: Player[] = [];

    // Ensure at least one of each position
    team.push(generateRandomPlayer('GK'));
    team.push(generateRandomPlayer('DEF'));
    team.push(generateRandomPlayer('MID'));
    team.push(generateRandomPlayer('FWD'));

    // Fill the rest randomly
    for (let i = team.length; i < size; i++) {
        team.push(generateRandomPlayer());
    }

    return team;
}
