import { StringField } from '@/decorators/field.decorators';

export class CreateLeagueReqDto {
    @StringField()
    name: string;

    @StringField()
    season: string;

    @StringField({ required: false })
    status?: string;
}
