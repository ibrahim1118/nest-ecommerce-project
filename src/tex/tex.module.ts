import { Module } from '@nestjs/common';
import { TexService } from './tex.service';
import { TexController } from './tex.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tex } from './entities/tex.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tex])],
  controllers: [TexController],
  providers: [TexService],
  exports : [TexService]
})
export class TexModule {}
