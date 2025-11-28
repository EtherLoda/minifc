import {
    BooleanField,
    DateField,
    StringField,
    StringFieldOptional,
    UUIDField,
    UUIDFieldOptional,
} from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';

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
    attributes: Record<string, any>;

    @DateField()
    @Expose()
    createdAt: Date;

    @DateField()
    @Expose()
    updatedAt: Date;
}
