import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AbacatePayService } from './abacatePay.service';
import { Public } from 'src/_core/decorator/public.decorator';

@Controller('abacate-pay')
export class AbacatePayController {
  constructor(private readonly abacatePayService: AbacatePayService) {}

  @Post('pix/cobrar/:id')
  async gerarPix(@Param('id') id: string) {
    return await this.abacatePayService.gerarPix(id);
  }

  @Post('pix')
  @Public()
  async hookPix(@Body() body: any) {
    return await this.abacatePayService.baixa(
      body.data.billing.products[0].externalId,
    );
  }
}
