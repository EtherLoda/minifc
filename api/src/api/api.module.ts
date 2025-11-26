import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PlayerModule } from './player/player.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, AuthModule, PlayerModule],
})
export class ApiModule { }
