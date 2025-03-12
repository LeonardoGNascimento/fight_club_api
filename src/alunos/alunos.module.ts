import { Module } from '@nestjs/common';
import { AlunosService } from './alunos.service';
import { AlunosController } from './alunos.controller';
import { CobrancaModule } from 'src/cobrancas/cobranca.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Precos } from '../_core/entity/precos.entity';
import { Alunos } from '../_core/entity/alunos.entity';
import { CobrancasCliente } from '../_core/entity/cobrancas-cliente.entity';
import { CobrancasClienteItems } from '../_core/entity/cobrancas-cliente-items.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Alunos, CobrancasClienteItems]),CobrancaModule],
  controllers: [AlunosController],
  providers: [AlunosService],
})
export class AlunosModule {}
