import { User } from '@clerk/express';
import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from './_core/decorator/currentUser.decorator';
import { AppService } from './app.service';

@Controller('')
export class AppController {
  constructor(private service: AppService) {}

  @Get('/dashboard')
  async dashboard(@CurrentUser() user: User) {
    return this.service.dashboard(
      user.privateMetadata.academiaId as string,
      user.privateMetadata.clienteId as string,
    );
  }

  @Get('/dashboard/atrasado')
  async dashboardAtrasados(@CurrentUser() user: User) {
    return this.service.atrasadas(user.privateMetadata.clienteId as string);
  }

  @Get('dashboard/mensalidade')
  async dashboardMensalidade(@CurrentUser() user: User) {
    return this.service.mensalidade(user.privateMetadata.clienteId as string);
  }

  @Get('dashboard/pagamento')
  async dashboardPrejuiso(@CurrentUser() user: User) {
    return this.service.prejuiso(user.privateMetadata.clienteId as string);
  }
}
