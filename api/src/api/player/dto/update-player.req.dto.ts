import { PartialType } from '@nestjs/swagger';
import { CreatePlayerReqDto } from './create-player.req.dto';

export class UpdatePlayerReqDto extends PartialType(CreatePlayerReqDto) { }
