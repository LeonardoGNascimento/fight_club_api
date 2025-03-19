import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CobrancasCliente } from '../_core/entity/cobrancas-cliente.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(CobrancasCliente)
    private cobrancasClientesRepository: Repository<CobrancasCliente>,
  ) {}

  async mensalidade(clientesId: string) {
    return this.cobrancasClientesRepository.find({
      relations: ['items'],
      where: {
        cliente: {
          id: clientesId,
        },
      },
    });
  }
}
