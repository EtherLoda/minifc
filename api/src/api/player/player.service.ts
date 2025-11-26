import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@/common/types/common.type';
import { paginate } from '@/utils/offset-pagination';
import { Injectable } from '@nestjs/common';
import assert from 'assert';
import { plainToInstance } from 'class-transformer';
import { CreatePlayerReqDto } from './dto/create-player.req.dto';
import { ListPlayerReqDto } from './dto/list-player.req.dto';
import { PlayerResDto } from './dto/player.res.dto';
import { UpdatePlayerReqDto } from './dto/update-player.req.dto';
import { PlayerEntity } from './entities/player.entity';

@Injectable()
export class PlayerService {
    constructor() { }

    async findMany(
        reqDto: ListPlayerReqDto,
    ): Promise<OffsetPaginatedDto<PlayerResDto>> {
        const query = PlayerEntity.createQueryBuilder('player').orderBy(
            'player.createdAt',
            'DESC',
        );
        const [players, metaDto] = await paginate<PlayerEntity>(query, reqDto, {
            skipCount: false,
            takeAll: false,
        });

        return new OffsetPaginatedDto(
            players.map((player) => this.mapToResDto(player)),
            metaDto,
        );
    }

    async findOne(id: Uuid): Promise<PlayerResDto> {
        assert(id, 'id is required');
        const player = await PlayerEntity.findOneByOrFail({ id });

        return this.mapToResDto(player);
    }

    async create(reqDto: CreatePlayerReqDto): Promise<PlayerResDto> {
        const player = new PlayerEntity({
            name: reqDto.name,
            position: reqDto.position,
            skinTone: reqDto.appearance.skinTone,
            hairColor: reqDto.appearance.hairColor,
            hairStyle: reqDto.appearance.hairStyle,
            bodyType: reqDto.appearance.bodyType,
            jerseyColorPrimary: reqDto.appearance.jerseyColorPrimary,
            jerseyColorSecondary: reqDto.appearance.jerseyColorSecondary,
            accessory: reqDto.appearance.accessory,
            speed: reqDto.stats.speed,
            power: reqDto.stats.power,
            skill: reqDto.stats.skill,
        });

        await player.save();

        return this.mapToResDto(player);
    }

    async update(id: Uuid, reqDto: UpdatePlayerReqDto): Promise<PlayerResDto> {
        assert(id, 'id is required');
        const player = await PlayerEntity.findOneByOrFail({ id });

        if (reqDto.name) player.name = reqDto.name;
        if (reqDto.position) player.position = reqDto.position;

        if (reqDto.appearance) {
            if (reqDto.appearance.skinTone) player.skinTone = reqDto.appearance.skinTone;
            if (reqDto.appearance.hairColor) player.hairColor = reqDto.appearance.hairColor;
            if (reqDto.appearance.hairStyle) player.hairStyle = reqDto.appearance.hairStyle;
            if (reqDto.appearance.bodyType) player.bodyType = reqDto.appearance.bodyType;
            if (reqDto.appearance.jerseyColorPrimary)
                player.jerseyColorPrimary = reqDto.appearance.jerseyColorPrimary;
            if (reqDto.appearance.jerseyColorSecondary)
                player.jerseyColorSecondary = reqDto.appearance.jerseyColorSecondary;
            if (reqDto.appearance.accessory) player.accessory = reqDto.appearance.accessory;
        }

        if (reqDto.stats) {
            if (reqDto.stats.speed) player.speed = reqDto.stats.speed;
            if (reqDto.stats.power) player.power = reqDto.stats.power;
            if (reqDto.stats.skill) player.skill = reqDto.stats.skill;
        }

        await player.save();

        return this.mapToResDto(player);
    }

    async delete(id: Uuid): Promise<void> {
        assert(id, 'id is required');
        const player = await PlayerEntity.findOneByOrFail({ id });
        await player.softRemove();
    }

    async generateRandom(count: number = 1): Promise<PlayerResDto[]> {
        const players: PlayerResDto[] = [];

        const firstNames = [
            'Marcus', 'Leo', 'Diego', 'Carlos', 'Andre', 'Paulo', 'Roberto',
            'Fernando', 'Luis', 'Miguel', 'Rafael', 'Gabriel', 'Juan', 'Pedro',
            'Antonio', 'Manuel', 'Jose', 'David', 'Daniel', 'Alex',
        ];

        const lastNames = [
            'Silva', 'Santos', 'Rodriguez', 'Martinez', 'Garcia', 'Lopez',
            'Gonzalez', 'Perez', 'Sanchez', 'Ramirez', 'Torres', 'Flores',
            'Rivera', 'Gomez', 'Diaz', 'Cruz', 'Morales', 'Reyes', 'Ortiz', 'Gutierrez',
        ];

        const positions = ['GK', 'DEF', 'MID', 'FWD'];
        const skinTones = ['#F4C2A5', '#E0AC69', '#C68642', '#8D5524', '#5C3317'];
        const hairStyles = ['buzz', 'short', 'messy', 'spiky', 'mohawk', 'afro'];
        const hairColors = ['#000000', '#2C1B18', '#B55239', '#E9C67B', '#F2E8C9'];
        const bodyTypes = ['thin', 'normal'];
        const accessories = ['none', 'glasses', 'bandana'];
        const jerseyColors = [
            '#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#FF00FF',
            '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A',
        ];

        for (let i = 0; i < count; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const position = positions[Math.floor(Math.random() * positions.length)];

            const player = new PlayerEntity({
                name: `${firstName} ${lastName}`,
                position,
                skinTone: skinTones[Math.floor(Math.random() * skinTones.length)],
                hairColor: hairColors[Math.floor(Math.random() * hairColors.length)],
                hairStyle: hairStyles[Math.floor(Math.random() * hairStyles.length)],
                bodyType: bodyTypes[Math.floor(Math.random() * bodyTypes.length)],
                jerseyColorPrimary: jerseyColors[Math.floor(Math.random() * jerseyColors.length)],
                jerseyColorSecondary: jerseyColors[Math.floor(Math.random() * jerseyColors.length)],
                accessory: accessories[Math.floor(Math.random() * accessories.length)],
                speed: Math.floor(Math.random() * 30) + 70, // 70-99
                power: Math.floor(Math.random() * 30) + 70, // 70-99
                skill: Math.floor(Math.random() * 30) + 70, // 70-99
            });

            await player.save();
            players.push(this.mapToResDto(player));
        }

        return players;
    }

    private mapToResDto(player: PlayerEntity): PlayerResDto {
        return plainToInstance(PlayerResDto, {
            id: player.id,
            name: player.name,
            position: player.position,
            appearance: {
                skinTone: player.skinTone,
                hairColor: player.hairColor,
                hairStyle: player.hairStyle,
                bodyType: player.bodyType,
                jerseyColorPrimary: player.jerseyColorPrimary,
                jerseyColorSecondary: player.jerseyColorSecondary,
                accessory: player.accessory,
            },
            stats: {
                speed: player.speed,
                power: player.power,
                skill: player.skill,
            },
            createdBy: player.createdBy,
            updatedBy: player.updatedBy,
            createdAt: player.createdAt,
            updatedAt: player.updatedAt,
        });
    }
}
