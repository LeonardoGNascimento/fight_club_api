import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { clerkClient } from '@clerk/express';

@Controller('')
export class AppController {
  constructor(private service: AppService) {}

  @Get('/dashboard')
  async dashboard(@Req() req: any) {
    const user = await clerkClient.users.getUser(req.auth.userId);

    return this.service.dashboard(
      user.privateMetadata.academiaId as string,
      user.privateMetadata.clienteId as string,
    );
  }
}
