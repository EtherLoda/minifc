import {
    NumberField,
    StringField,
} from '@/decorators/field.decorators';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsObject, Max, Min, ValidateNested } from 'class-validator';

export class PlayerAppearanceDto {
    @StringField()
    skinTone: string;

    @StringField()
    hairColor: string;

    @StringField()
    hairStyle: string;

    @StringField()
    bodyType: string;

    @StringField()
    jerseyColorPrimary: string;

    @StringField()
    jerseyColorSecondary: string;

    @StringField()
    accessory: string;
}

export class PlayerStatsDto {
    @NumberField()
    @IsInt()
    @Min(1)
    @Max(99)
    speed: number;

    @NumberField()
    @IsInt()
    @Min(1)
    @Max(99)
    power: number;

    @NumberField()
    @IsInt()
    @Min(1)
    @Max(99)
    skill: number;
}

export class CreatePlayerReqDto {
    @StringField()
    readonly name: string;

    @StringField()
    readonly position: string;

    @ApiProperty({ type: PlayerAppearanceDto })
    @IsObject()
    @ValidateNested()
    @Type(() => PlayerAppearanceDto)
    readonly appearance: PlayerAppearanceDto;

    @ApiProperty({ type: PlayerStatsDto })
    @IsObject()
    @ValidateNested()
    @Type(() => PlayerStatsDto)
    readonly stats: PlayerStatsDto;
}
