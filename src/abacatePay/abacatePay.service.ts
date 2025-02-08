import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/_core/prisma.service';

@Injectable()
export class AbacatePayService {
  constructor(private prisma: PrismaService) {}

  async gerarPix() {
    const data = await fetch('https://api.abacatepay.com/v1/billing/create', {
      method: 'POST',
      body: JSON.stringify({
        frequency: 'ONE_TIME',
        methods: ['PIX'],
        customerId: 'cust_4RY6zKnpB5bytRjRe31N2k5k',
        products: [
          {
            externalId: 'cm6vmg0sy0001mk0nedp7dfdb',
            name: 'Cobrança mensal uso app',
            quantity: 1,
            price: 100,
          },
        ],
        returnUrl: 'https://dojoplanner.com.br',
        completionUrl: 'https://dojoplanner.com.br',
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer abc_dev_ywCuQLmMGZ21tRFtkPsWksCY`,
      },
    });
    return await data.json();
  }

  async baixa(id: string) {
    await this.prisma.cobrancasCliente.update({
      where: {
        id,
      },
      data: {
        pago: true,
      },
    });
  }
}
