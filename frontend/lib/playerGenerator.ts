import { Player, PlayerAppearance, Position, SkinTone, HairStyle, BodyType, Accessory } from '@/types/player';
import { getRandomNameByNationality, getRandomNationality } from './nameDatabase';

const skinTones: SkinTone[] = ['#F4C2A5', '#E0AC69', '#C68642', '#8D5524', '#5C3317'];
const hairColors = ['#2C1810', '#8B4513', '#D2691E', '#FFD700', '#FF6B35', '#000000', '#FFFFFF'];
const hairStyles: HairStyle[] = ['buzz', 'short', 'messy', 'spiky', 'mohawk', 'afro'];
const bodyTypes: BodyType[] = ['thin', 'normal'];
const accessories: Accessory[] = ['none', 'glasses', 'bandana'];
const jerseyColors = ['#FF4444', '#4444FF', '#44FF44', '#FF8C00', '#9333EA', '#EC4899', '#14B8A6'];

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

export function generateRandomPlayer(position?: Position, nationality?: string): Player {
    const positions: Position[] = ['GK', 'DEF', 'MID', 'FWD'];
    const selectedPosition = position || getRandomElement(positions);
    const playerNationality = nationality || getRandomNationality();
    const { firstName, lastName } = getRandomNameByNationality(playerNationality);

    return {
        id: `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: `${firstName} ${lastName}`,
        position: selectedPosition,
        appearance: generateRandomAppearance(),
        stats: {
            speed: getRandomStat(),
            power: getRandomStat(),
            skill: getRandomStat(),
        },
    };
}

export function generateTeam(size: number = 11, nationality?: string): Player[] {
    const team: Player[] = [];

    // Ensure at least one of each position
    team.push(generateRandomPlayer('GK', nationality));
    team.push(generateRandomPlayer('DEF', nationality));
    team.push(generateRandomPlayer('MID', nationality));
    team.push(generateRandomPlayer('FWD', nationality));

    // Fill the rest randomly
    for (let i = team.length; i < size; i++) {
        team.push(generateRandomPlayer(undefined, nationality));
    }

    return team;
}
