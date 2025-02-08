import { Injectable } from '@nestjs/common';

@Injectable()
export class AbacatePayService {
  async gerarPix() {
    const data = await fetch('https://api.abacatepay.com/v1/billing/create', {
      method: 'POST',
      body: JSON.stringify({
        frequency: 'ONE_TIME',
        methods: ['PIX'],
        customerId: 'cust_4RY6zKnpB5bytRjRe31N2k5k',
        products: [
          {
            externalId: '123',
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
}
