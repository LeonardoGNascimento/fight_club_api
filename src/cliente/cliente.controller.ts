import { Controller, Get, Req } from '@nestjs/common';
import { ClienteService } from './cliente.service';

@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Get('mensalidade')
  mensalidade(@Req() req) {
    return this.clienteService.mensalidade(req.user.clienteId);
  }
}
