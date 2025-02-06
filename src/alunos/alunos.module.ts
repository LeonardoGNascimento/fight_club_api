import { Module } from '@nestjs/common';
import { AlunosService } from './alunos.service';
import { AlunosController } from './alunos.controller';
import { CobrancaModule } from 'src/cobrancas/cobranca.module';

@Module({
  imports: [CobrancaModule],
  controllers: [AlunosController],
  providers: [AlunosService],
})
export class AlunosModule {}
