import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';
import { Cobrancas } from './_core/entity/cobrancas.entity';

@Controller('')
export class AppController {
  constructor(private service: AppService) {}

  @Get('/health')
  @Public()
  health() {
    return true;
  }
}
