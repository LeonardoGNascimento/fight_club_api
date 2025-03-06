import { Module } from '@nestjs/common';
import { GraducaoController } from './graducao.controller';

@Module({
  controllers: [GraducaoController],
})
export class GraduacaoModule {}
