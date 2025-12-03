import {
    BooleanField,
    DateField,
    NumberField,
    StringField,
    StringFieldOptional,
    UUIDField,
    UUIDFieldOptional,
} from '@/decorators/field.decorators';
import { PotentialTier, TrainingSlot, PlayerSkills } from '@goalxi/database';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class PlayerResDto {
    @UUIDField()
    @Expose()
    id: string;

    @UUIDFieldOptional()
    @Expose()
    teamId?: string | null;

    @StringField()
    @Expose()
    name: string;

    @DateField({ nullable: true })
    @Expose()
    birthday?: Date;

    @BooleanField()
    @Expose()
    isYouth: boolean;

    @NumberField({ int: true })
    @Expose()
    age: number;

    @Expose()
    appearance: Record<string, any>;



    @BooleanField()
    @Expose()
    isGoalkeeper: boolean;

    @BooleanField()
    @Expose()
    onTransfer: boolean;

    @Expose()
    @Transform(({ value }) => {
        if (!value) return value;
        const rounded: any = { physical: {}, technical: {}, mental: {} };

        // Round all skill values to integers
        for (const category of ['physical', 'technical', 'mental']) {
            if (value[category]) {
                rounded[category] = {};
                for (const attr in value[category]) {
                    rounded[category][attr] = Math.round(value[category][attr]);
                }
            }
        }
        return rounded;
    })
    currentSkills: PlayerSkills;

    @Expose()
    @Transform(({ value }) => {
        if (!value) return value;
        const rounded: any = { physical: {}, technical: {}, mental: {} };

        // Round all skill values to integers
        for (const category of ['physical', 'technical', 'mental']) {
            if (value[category]) {
                rounded[category] = {};
                for (const attr in value[category]) {
                    rounded[category][attr] = Math.round(value[category][attr]);
                }
            }
        }
        return rounded;
    })
    potentialSkills: PlayerSkills;

    @NumberField({ int: true })
    @Expose()
    potentialAbility: number;

    @Expose()
    potentialTier: PotentialTier;

    @Expose()
    trainingSlot: TrainingSlot;

    @NumberField()
    @Expose()
    @Transform(({ value }) => Math.round(value * 10) / 10) // Round to 1 decimal
    experience: number;

    @NumberField()
    @Expose()
    @Transform(({ value }) => Math.round(value * 10) / 10) // Round to 1 decimal
    form: number;

    @NumberField()
    @Expose()
    @Transform(({ value }) => Math.round(value * 10) / 10) // Round to 1 decimal
    stamina: number;

    @DateField()
    @Expose()
    createdAt: Date;

    @DateField()
    @Expose()
    updatedAt: Date;
}
