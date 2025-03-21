import { Module } from '@nestjs/common';
import { AbacatePayController } from './abacatePay.controller';
import { AbacatePayService } from './abacatePay.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agendas } from '../_core/entity/agendas.entity';
import { CobrancasCliente } from '../_core/entity/cobrancas-cliente.entity';
import { CobrancasClienteItems } from '../_core/entity/cobrancas-cliente-items.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CobrancasCliente, CobrancasClienteItems, CobrancasCliente]),
  ],
  controllers: [AbacatePayController],
  providers: [AbacatePayService],
})
export class AbacatePayModule {}
