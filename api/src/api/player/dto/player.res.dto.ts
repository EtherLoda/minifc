import {
    ClassField,
    DateField,
    NumberField,
    StringField,
    UUIDField,
} from '@/decorators/field.decorators';
import { WrapperType } from '@/common/types/types';
import { Exclude, Expose, Type } from 'class-transformer';

export class PlayerAppearanceResDto {
    @StringField()
    @Expose()
    skinTone: string;

    @StringField()
    @Expose()
    hairColor: string;

    @StringField()
    @Expose()
    hairStyle: string;

    @StringField()
    @Expose()
    bodyType: string;

    @StringField()
    @Expose()
    jerseyColorPrimary: string;

    @StringField()
    @Expose()
    jerseyColorSecondary: string;

    @StringField()
    @Expose()
    accessory: string;
}

export class PlayerStatsResDto {
    @NumberField()
    @Expose()
    speed: number;

    @NumberField()
    @Expose()
    power: number;

    @NumberField()
    @Expose()
    skill: number;
}

@Exclude()
export class PlayerResDto {
    @UUIDField()
    @Expose()
    id: string;

    @StringField()
    @Expose()
    name: string;

    @StringField()
    @Expose()
    position: string;

    @ClassField(() => PlayerAppearanceResDto)
    @Expose()
    @Type(() => PlayerAppearanceResDto)
    appearance: WrapperType<PlayerAppearanceResDto>;

    @ClassField(() => PlayerStatsResDto)
    @Expose()
    @Type(() => PlayerStatsResDto)
    stats: WrapperType<PlayerStatsResDto>;

    @StringField()
    @Expose()
    createdBy: string;

    @StringField()
    @Expose()
    updatedBy: string;

    @DateField()
    @Expose()
    createdAt: Date;

    @DateField()
    @Expose()
    updatedAt: Date;
}
