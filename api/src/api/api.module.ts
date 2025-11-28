import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { LeagueModule } from './league/league.module';
import { PlayerModule } from './player/player.module';
import { TeamModule } from './team/team.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, AuthModule, PlayerModule, LeagueModule, TeamModule],
})
export class ApiModule { }
