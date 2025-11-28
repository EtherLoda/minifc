import { Uuid } from '@/common/types/common.type';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateLeagueReqDto } from './dto/create-league.req.dto';
import { LeagueResDto } from './dto/league.res.dto';
import { ListLeagueReqDto } from './dto/list-league.req.dto';
import { UpdateLeagueReqDto } from './dto/update-league.req.dto';
import { LeagueService } from './league.service';

@ApiTags('League')
@Controller({
    path: 'leagues',
    version: '1',
})
export class LeagueController {
    constructor(private readonly leagueService: LeagueService) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findMany(@Query() query: ListLeagueReqDto) {
        return this.leagueService.findMany(query);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id') id: Uuid): Promise<LeagueResDto> {
        return this.leagueService.findOne(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: CreateLeagueReqDto): Promise<LeagueResDto> {
        return this.leagueService.create(dto);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: Uuid,
        @Body() dto: UpdateLeagueReqDto,
    ): Promise<LeagueResDto> {
        return this.leagueService.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id') id: Uuid): Promise<void> {
        return this.leagueService.delete(id);
    }
}
