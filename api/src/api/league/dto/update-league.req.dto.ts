import { StringFieldOptional } from '@/decorators/field.decorators';

export class UpdateLeagueReqDto {
    @StringFieldOptional()
    name?: string;

    @StringFieldOptional()
    season?: string;

    @StringFieldOptional()
    status?: string;
}
