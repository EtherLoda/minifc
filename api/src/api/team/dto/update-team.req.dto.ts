import { StringFieldOptional, UUIDFieldOptional } from '@/decorators/field.decorators';

export class UpdateTeamReqDto {
    @StringFieldOptional()
    name?: string;

    @UUIDFieldOptional()
    leagueId?: string;

    @StringFieldOptional()
    logoUrl?: string;

    @StringFieldOptional()
    jerseyColorPrimary?: string;

    @StringFieldOptional()
    jerseyColorSecondary?: string;
}
