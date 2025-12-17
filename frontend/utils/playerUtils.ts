import { PlayerAppearance, SkinTone, HairStyle, BodyType, Accessory } from '@/types/player';

export function generateAppearance(playerId: string): PlayerAppearance {
    let hash = 0;
    for (let i = 0; i < playerId.length; i++) {
        hash = playerId.charCodeAt(i) + ((hash << 5) - hash);
    }

    const skinTones: SkinTone[] = ['#F4C2A5', '#E0AC69', '#C68642', '#8D5524', '#5C3317'];
    const hairStyles: HairStyle[] = ['buzz', 'short', 'messy', 'spiky', 'mohawk', 'afro'];
    const bodyTypes: BodyType[] = ['thin', 'normal'];
    const accessories: Accessory[] = ['none', 'none', 'none', 'glasses', 'bandana'];

    const h1 = Math.abs(hash);
    const h2 = Math.abs(hash >> 5);
    const h3 = Math.abs(hash >> 10);

    return {
        skinTone: skinTones[h1 % skinTones.length],
        hairColor: `#${(h2 % 1000000).toString(16).padStart(6, '3')}`, // darkish colors usually
        hairStyle: hairStyles[h3 % hairStyles.length],
        bodyType: bodyTypes[h1 % bodyTypes.length],
        jerseyColorPrimary: '#10b981',
        jerseyColorSecondary: '#ffffff',
        accessory: accessories[h2 % accessories.length]
    };
}
