import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './_core/core.module';
import { AcademiasModule } from './academias/academias.module';
import { AlunosModule } from './alunos/alunos.module';
import { CobrancaModule } from './cobrancas/cobranca.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CoreModule,
    CobrancaModule,
    AcademiasModule,
    AlunosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
