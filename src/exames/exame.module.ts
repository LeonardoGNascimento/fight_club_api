import { Module } from '@nestjs/common';
import { ExameController } from './exame.controller';
import { ExameService } from './exame.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamesGraduacao } from 'src/_core/entity/exames-graduacao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExamesGraduacao])],
  controllers: [ExameController],
  providers: [ExameService],
})
export class ExameModule {}
