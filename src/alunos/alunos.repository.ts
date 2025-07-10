import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { async } from 'src/_core/async';
import { Alunos, Status } from 'src/_core/entity/alunos.entity';
import { Repository } from 'typeorm';
import { CreateAlunoDto } from './dto/criar-aluno.dto';

@Injectable()
export class AlunosRepository {
  constructor(
    @InjectRepository(Alunos) private alunosRepository: Repository<Alunos>,
  ) {}

  async buscar(id: string) {
    const [aluno, erro] = await async<Alunos>(
      this.alunosRepository.findOne({
        relations: {
          plano: true,
          alunosModalidades: {
            modalidade: true,
            graduacao: true,
          },
        },
        where: {
          id,
          deleted: null,
        },
      }),
    );

    if (erro) {
      return null;
    }

    return aluno;
  }

  async criar(dto: CreateAlunoDto) {
    return await this.alunosRepository.save({
      academia: { id: String(dto.academiaId) },
      nome: dto.nome,
      cep: dto.cep,
      cidade: dto.cidade,
      cpf: dto.cpf,
      estado: dto.estado,
      numero: dto.numero,
      plano: { id: dto.plano },
      rua: dto.rua,
      telefone: dto.telefone,
      status: Status.ATIVO,
    });
  }
}
