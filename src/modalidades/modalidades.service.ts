import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { format, lastDayOfMonth } from 'date-fns';
import { CobrancaService } from 'src/cobrancas/cobranca.service';
import { AtualizarGraduacaoDto } from './dto/atualizarGraducao.dto';
import { CreateAlunoDto } from './dto/createAluno.dto';
import { ListarAlunosDto } from './dto/listarAlunos.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Alunos, Status } from '../_core/entity/alunos.entity';
import { Repository } from 'typeorm';
import { CobrancasClienteItems } from '../_core/entity/cobrancas-cliente-items.entity';
import { CobrancasClienteItemsTipo } from '../_core/entity/cobrancas-cliente-items-tipo.enum';
import { async } from 'src/_core/async';
import { AlunosGraducao } from '../_core/entity/alunos-graducao.entity';
import { Graduacoes } from '../_core/entity/graduacoes.entity';
import { Planos } from '../_core/entity/planos.entity';
import { AlunosExamesGraducao } from '../_core/entity/alunos-exames-graducao.entity';
import { Cobrancas } from '../_core/entity/cobrancas.entity';
import { Modalidades } from '../_core/entity/modalidades.entity';

@Injectable()
export class ModalidadesService {
  constructor(
    @InjectRepository(Graduacoes)
    private graduacoesRepository: Repository<Graduacoes>,
    @InjectRepository(Modalidades)
    private modalidadesRepository: Repository<Modalidades>,
  ) {}

  async create({ nome, academiasId, graduacoes }: any) {
    const modalidade = await this.modalidadesRepository.save({
      dataHora: new Date(),
      nome,
      academiasId,
    });

    if (graduacoes && graduacoes.length > 0) {
      for (const [index, item] of graduacoes.entries()) {
        await this.graduacoesRepository.save({
          ...item,
          modalidadesId: modalidade.id,
          ordem: index + 1,
        });
      }
    }
  }

  async findAll(academiaId: string): Promise<Modalidades[]> {
    return await this.modalidadesRepository.find({
      relations: {
        graduacoes: true,
      },
      where: {
        academia: {
          id: academiaId,
        },
      },
    });
  }
}
