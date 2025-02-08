import { Module } from '@nestjs/common';
import { AbacatePayController } from './abacatePay.controller';
import { AbacatePayService } from './abacatePay.service';

@Module({
  controllers: [AbacatePayController],
  providers: [AbacatePayService],
})
export class AbacatePayModule {}
