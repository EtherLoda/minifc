import { Expose } from 'class-transformer';

export class LeagueResDto {
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    season: string;

    @Expose()
    status: string;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}
