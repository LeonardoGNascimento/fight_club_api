import { Module } from '@nestjs/common';
import { CobrancaService } from './cobranca.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CobrancasCliente } from '../_core/entity/cobrancas-cliente.entity';
import { CobrancasClienteItems } from '../_core/entity/cobrancas-cliente-items.entity';
import { Precos } from '../_core/entity/precos.entity';
import { Clientes } from '../_core/entity/clientes.entity';
import { Alunos } from '../_core/entity/alunos.entity';
import { Cobrancas } from '../_core/entity/cobrancas.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CobrancasCliente,
      CobrancasClienteItems,
      Precos,
      Clientes,
      Alunos,
      Cobrancas,
    ]),
  ],
  providers: [CobrancaService],
  exports: [CobrancaService],
})
export class CobrancaModule {}
