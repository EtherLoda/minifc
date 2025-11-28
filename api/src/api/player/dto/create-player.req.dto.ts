import { BooleanFieldOptional, DateFieldOptional, StringField, StringFieldOptional, UUIDFieldOptional } from '@/decorators/field.decorators';
import { IsObject, IsOptional } from 'class-validator';

export class CreatePlayerReqDto {
    @StringField()
    name!: string;

    @UUIDFieldOptional()
    teamId?: string;

    @DateFieldOptional()
    birthday?: Date;

    @IsOptional()
    @IsObject()
    appearance?: Record<string, any>;

    @StringFieldOptional()
    position?: string;

    @BooleanFieldOptional()
    isGoalkeeper?: boolean;

    @IsOptional()
    @IsObject()
    attributes?: Record<string, any>;
}
