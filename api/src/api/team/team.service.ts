import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@/common/types/common.type';
import { ErrorCode } from '@/constants/error-code.constant';
import { ValidationException } from '@/exceptions/validation.exception';
import { paginate } from '@/utils/offset-pagination';
import { Injectable } from '@nestjs/common';
import assert from 'assert';
import { plainToInstance } from 'class-transformer';
import { CreateTeamReqDto } from './dto/create-team.req.dto';
import { ListTeamReqDto } from './dto/list-team.req.dto';
import { TeamResDto } from './dto/team.res.dto';
import { UpdateTeamReqDto } from './dto/update-team.req.dto';
import { TeamEntity } from '@goalxi/database';

import { PlayerService } from '../player/player.service';
import { PlayerEntity } from '@goalxi/database';

@Injectable()
export class TeamService {
    constructor(
        private readonly playerService: PlayerService,
    ) { }

    async findMany(
        reqDto: ListTeamReqDto,
    ): Promise<OffsetPaginatedDto<TeamResDto>> {
        const query = TeamEntity.createQueryBuilder('team').orderBy(
            'team.createdAt',
            'DESC',
        );
        const [teams, metaDto] = await paginate<TeamEntity>(query, reqDto, {
            skipCount: false,
            takeAll: false,
        });

        return new OffsetPaginatedDto(
            teams.map((team) => this.mapToResDto(team)),
            metaDto,
        );
    }

    async findOne(id: string): Promise<TeamResDto> {
        assert(id, 'id is required');

        // Generic UUID regex to prevent DB errors
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            throw new ValidationException(ErrorCode.E002, 'Invalid ID format');
        }

        const team = await TeamEntity.findOneByOrFail({ id: id as Uuid });

        // Auto-generate players if team has none (e.g. for existing teams before this logic)
        const playersCount = await PlayerEntity.countBy({ teamId: team.id });
        if (playersCount === 0) {
            await this.playerService.generateRandom(18, team.id);
        }

        return this.mapToResDto(team);
    }

    async findByUserId(userId: Uuid): Promise<TeamResDto | null> {
        assert(userId, 'userId is required');
        const team = await TeamEntity.findOneBy({ userId });

        return team ? this.mapToResDto(team) : null;
    }

    async create(reqDto: CreateTeamReqDto): Promise<TeamResDto> {
        // Check if user already has a team (one-to-one relationship)
        const existingTeam = await TeamEntity.findOneBy({ userId: reqDto.userId });
        if (existingTeam) {
            throw new ValidationException(ErrorCode.E001, 'User already has a team');
        }

        const team = new TeamEntity({
            userId: reqDto.userId,
            name: reqDto.name,
            leagueId: reqDto.leagueId || null,
            logoUrl: reqDto.logoUrl || '',
            jerseyColorPrimary: reqDto.jerseyColorPrimary || '#FF0000',
            jerseyColorSecondary: reqDto.jerseyColorSecondary || '#FFFFFF',
        });

        await team.save();

        // Initialize team with a starting squad of 18 players
        await this.playerService.generateRandom(18, team.id);

        return this.mapToResDto(team);
    }

    async update(id: Uuid, reqDto: UpdateTeamReqDto): Promise<TeamResDto> {
        assert(id, 'id is required');
        const team = await TeamEntity.findOneByOrFail({ id });

        if (reqDto.name) team.name = reqDto.name;
        if (reqDto.leagueId !== undefined) team.leagueId = reqDto.leagueId || null;
        if (reqDto.logoUrl !== undefined) team.logoUrl = reqDto.logoUrl;
        if (reqDto.jerseyColorPrimary) team.jerseyColorPrimary = reqDto.jerseyColorPrimary;
        if (reqDto.jerseyColorSecondary) team.jerseyColorSecondary = reqDto.jerseyColorSecondary;

        await team.save();

        return this.mapToResDto(team);
    }

    async delete(id: Uuid): Promise<void> {
        assert(id, 'id is required');
        const team = await TeamEntity.findOneByOrFail({ id });
        await team.softRemove();
    }

    private mapToResDto(team: TeamEntity): TeamResDto {
        return plainToInstance(TeamResDto, {
            id: team.id,
            userId: team.userId,
            leagueId: team.leagueId,
            name: team.name,
            logoUrl: team.logoUrl,
            jerseyColorPrimary: team.jerseyColorPrimary,
            jerseyColorSecondary: team.jerseyColorSecondary,
            createdAt: team.createdAt,
            updatedAt: team.updatedAt,
        });
    }
}
