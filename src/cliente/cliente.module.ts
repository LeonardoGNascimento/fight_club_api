import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';
import { CobrancasCliente } from '../_core/entity/cobrancas-cliente.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CobrancasCliente])],
  controllers: [ClienteController],
  providers: [ClienteService],
})
export class ClienteModule {}
