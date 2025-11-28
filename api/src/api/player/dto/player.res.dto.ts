import {
    BooleanField,
    DateField,
    NumberField,
    StringField,
    StringFieldOptional,
    UUIDField,
    UUIDFieldOptional,
} from '@/decorators/field.decorators';
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

    @Expose()
    appearance: Record<string, any>;

    @StringFieldOptional()
    @Expose()
    position?: string;

    @BooleanField()
    @Expose()
    isGoalkeeper: boolean;

    @BooleanField()
    @Expose()
    onTransfer: boolean;

    @Expose()
    @Transform(({ value }) => {
        // Round all attribute values to integers for display
        if (!value) return value;
        const rounded: any = {};
        for (const category in value) {
            rounded[category] = {};
            for (const attr in value[category]) {
                rounded[category][attr] = Math.round(value[category][attr]);
            }
        }
        return rounded;
    })
    attributes: Record<string, any>;

    @NumberField()
    @Expose()
    @Transform(({ value }) => Math.round(value * 10) / 10) // Round to 1 decimal
    experience: number;

    @NumberField({ int: true })
    @Expose()
    form: number;

    @DateField()
    @Expose()
    createdAt: Date;

    @DateField()
    @Expose()
    updatedAt: Date;
}
