import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';
import { Cobrancas } from './_core/entity/cobrancas.entity';

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

  @Get('dashboard/proximos')
  proximos(@Req() req: any) {
    return this.service.proximos(req.user.academiaId);
  }

  @Get('/dashboard/alunos/:id')
  async dashboardAlunos(@Param('id') id: string) {
    return this.service.dashboardAlunos(id);
  }

  @Post('/interno/cliente/cobrar')
  @Public()
  cobrar() {
    return this.service.cobrar();
  }
}
