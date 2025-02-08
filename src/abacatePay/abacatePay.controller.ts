import { Body, Controller, Get, Post } from '@nestjs/common';
import { AbacatePayService } from './abacatePay.service';
import { Public } from 'src/_core/decorator/public.decorator';

@Controller('abacate-pay')
export class AbacatePayController {
  constructor(private readonly abacatePayService: AbacatePayService) {}

  @Get('pix')
  @Public()
  async gerarPix() {
    return await this.abacatePayService.gerarPix();
  }

  @Post('pix')
  @Public()
  async hookPix(@Body() body: any) {
    console.log('prodcut:', body.data.billing.products[0].externalId);

    return await this.abacatePayService.baixa(
      body.data.billing.products[0].externalId,
    );
  }
}
