import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { UserSeedService } from './seed/user.seed';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserSeedService],
  exports: [UserService],
})
export class UserModule implements OnModuleInit {
  constructor(private readonly seedService: UserSeedService) {}

  async onModuleInit() {
    await this.seedService.seed();
  }
}
