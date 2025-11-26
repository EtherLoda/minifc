import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@/common/types/common.type';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreatePlayerReqDto } from './dto/create-player.req.dto';
import { GenerateRandomPlayerReqDto } from './dto/generate-random-player.req.dto';
import { ListPlayerReqDto } from './dto/list-player.req.dto';
import { PlayerResDto } from './dto/player.res.dto';
import { UpdatePlayerReqDto } from './dto/update-player.req.dto';
import { PlayerService } from './player.service';

@ApiTags('Players')
@Controller('players')
export class PlayerController {
    constructor(private readonly playerService: PlayerService) { }

    @Post()
    @ApiOkResponse({ type: PlayerResDto })
    async create(@Body() createPlayerDto: CreatePlayerReqDto): Promise<PlayerResDto> {
        return this.playerService.create(createPlayerDto);
    }

    @Get()
    @ApiOkResponse({ type: OffsetPaginatedDto<PlayerResDto> })
    async findAll(
        @Query() query: ListPlayerReqDto,
    ): Promise<OffsetPaginatedDto<PlayerResDto>> {
        return this.playerService.findMany(query);
    }

    @Get(':id')
    @ApiOkResponse({ type: PlayerResDto })
    async findOne(@Param('id') id: Uuid): Promise<PlayerResDto> {
        return this.playerService.findOne(id);
    }

    @Patch(':id')
    @ApiOkResponse({ type: PlayerResDto })
    async update(
        @Param('id') id: Uuid,
        @Body() updatePlayerDto: UpdatePlayerReqDto,
    ): Promise<PlayerResDto> {
        return this.playerService.update(id, updatePlayerDto);
    }

    @Delete(':id')
    @ApiOkResponse({ type: PlayerResDto })
    async remove(@Param('id') id: Uuid): Promise<void> {
        return this.playerService.delete(id);
    }

    @Post('generate')
    @ApiOkResponse({ type: [PlayerResDto] })
    async generateRandom(
        @Body() dto: GenerateRandomPlayerReqDto,
    ): Promise<PlayerResDto[]> {
        return this.playerService.generateRandom(dto.count);
    }
}
