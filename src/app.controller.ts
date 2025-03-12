import { Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';
import { Public } from './_core/decorator/public.decorator';
import { Cobrancas } from '@prisma/client';
import { User } from './_core/interfaces/user.interface';

@Controller('')
export class AppController {
  constructor(private service: AppService) {}

  @Get('/dashboard/atrasado')
  async dashboardAtrasados(@Req() req): Promise<Cobrancas[]> {
    return this.service.atrasadas(req.user.clienteId);
  }

  @Get('dashboard/mensalidade')
  async dashboardMensalidade(@Req() req) {
    return this.service.mensalidade(req.user.clienteId);
  }

  @Get('dashboard/pagamento')
  async dashboardPrejuiso(@Req() req) {
    return this.service.prejuiso(req.user.clienteId);
  }

  @Get('dashboard/eventos')
  dashboardEventos(@Req() req) {
    return this.service.proximos(req.user.clienteId);
  }

  @Post('/interno/cliente/cobrar')
  @Public()
  cobrar() {
    return this.service.cobrar();
  }
}
