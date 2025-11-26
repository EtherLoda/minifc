export type SkinTone = '#F4C2A5' | '#E0AC69' | '#C68642' | '#8D5524' | '#5C3317';

export type HairStyle = 'buzz' | 'short' | 'messy' | 'spiky' | 'mohawk' | 'afro';

export type BodyType = 'thin' | 'normal';

export type Accessory = 'none' | 'glasses' | 'bandana';

export type Position = 'GK' | 'DEF' | 'MID' | 'FWD';

export interface PlayerAppearance {
  skinTone: SkinTone;
  hairColor: string;
  hairStyle: HairStyle;
  bodyType: BodyType;
  jerseyColorPrimary: string;
  jerseyColorSecondary: string;
  accessory: Accessory;
}

export interface Player {
  id: string;
  name: string;
  position: Position;
  appearance: PlayerAppearance;
  stats: {
    speed: number;
    power: number;
    skill: number;
  };
}
