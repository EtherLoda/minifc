import { PlayerAppearance, SkinTone, HairStyle, BodyType, Accessory } from '@/types/player';

// Convert backend appearance format to frontend format
export function convertAppearance(backendAppearance: any): PlayerAppearance | null {
    if (!backendAppearance) return null;

    // Backend format can be:
    // 1. { skinTone: 1-6, hairStyle: 1-20, hairColor: string, facialHair: string } (from seed)
    // 2. { skinTone: 1-6, hairStyle: 1-10, hairColor: 1-8, facialHair: 0-5 } (from generateRandomAppearance)
    // Frontend format: { skinTone: '#C68642', hairStyle: 'short', hairColor: '#333', ... }

    const skinTones: SkinTone[] = ['#F4C2A5', '#E0AC69', '#C68642', '#8D5524', '#5C3317'];
    const hairStyles: HairStyle[] = ['buzz', 'short', 'messy', 'spiky', 'mohawk', 'afro'];
    const hairColorMap: Record<string, string> = {
        'black': '#1a1a1a',
        'brown': '#5c3317',
        'blonde': '#d4a574',
        'red': '#8b4513',
        'gray': '#808080',
        'grey': '#808080',
    };
    const hairColorNumbers: string[] = [
        '#1a1a1a', // black
        '#5c3317', // brown
        '#d4a574', // blonde
        '#8b4513', // red
        '#808080', // gray
        '#3b2414', // dark brown
        '#654321', // medium brown
        '#2c1810', // very dark brown
    ];

    // Convert skinTone (1-6) to color
    const skinToneIndex = typeof backendAppearance.skinTone === 'number' 
        ? Math.min(Math.max(backendAppearance.skinTone - 1, 0), skinTones.length - 1)
        : 2; // default to middle tone
    const skinTone = skinTones[skinToneIndex];

    // Convert hairStyle (1-20 or 1-10) to frontend format
    let hairStyle: HairStyle = 'short';
    if (typeof backendAppearance.hairStyle === 'number') {
        const styleIndex = backendAppearance.hairStyle % hairStyles.length;
        hairStyle = hairStyles[styleIndex];
    }

    // Convert hairColor (can be string or number)
    let hairColor = '#3b2414'; // default dark brown
    if (typeof backendAppearance.hairColor === 'string') {
        hairColor = hairColorMap[backendAppearance.hairColor.toLowerCase()] || hairColor;
    } else if (typeof backendAppearance.hairColor === 'number') {
        const colorIndex = Math.min(Math.max(backendAppearance.hairColor - 1, 0), hairColorNumbers.length - 1);
        hairColor = hairColorNumbers[colorIndex];
    }

    // Get jersey colors from team or use defaults
    const jerseyColorPrimary = backendAppearance.jerseyColorPrimary || '#10b981';
    const jerseyColorSecondary = backendAppearance.jerseyColorSecondary || '#ffffff';

    // Convert accessory (facialHair doesn't map directly, so we'll use none/glasses/bandana)
    let accessory: Accessory = 'none';
    if (backendAppearance.accessory) {
        if (['glasses', 'bandana'].includes(backendAppearance.accessory)) {
            accessory = backendAppearance.accessory as Accessory;
        }
    }

    return {
        skinTone,
        hairColor,
        hairStyle,
        bodyType: backendAppearance.bodyType || 'normal',
        jerseyColorPrimary,
        jerseyColorSecondary,
        accessory,
    };
}

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
