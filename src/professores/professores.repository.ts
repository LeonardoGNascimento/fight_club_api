import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { async } from 'src/_core/async';
import { Professores, Status } from 'src/_core/entity/professores.entity';
import { Repository } from 'typeorm';
import { CriarProfessorDto } from './dto/criarProfessor.dto';
import { EditarProfessorDto } from './dto/editarProfessor.dto';

@Injectable()
export class ProfessoresRepository {
  constructor(
    @InjectRepository(Professores)
    private professoresRepository: Repository<Professores>,
  ) {}

  async criar(dto: CriarProfessorDto) {
    const [data, error] = await async(
      this.professoresRepository.save({
        nome: dto.nome,
        cpf: dto.cpf,
        rg: dto.rg,
        endereco: dto.endereco,
        numero: dto.numero,
        complemento: dto.complemento,
        bairro: dto.bairro,
        cep: dto.cep,
        estado: dto.estado,
        cidade: dto.cidade,
        email: dto.email,
        telefone: dto.telefone,
        telefoneResidencial: dto.telefoneResidencial,
        nascimento: dto.nascimento,
        status: Status.ATIVO,
        academia: {
          id: dto.academiaId,
        },
      }),
    );

    return error ? null : data;
  }

  async buscar(id: string) {
    const [data, error] = await async(
      this.professoresRepository.findOne({
        where: {
          id,
        },
      }),
    );

    if (error) return null;

    return data;
  }

  async listar(academiaId: string): Promise<Professores[]> {
    const [data, error] = await async(
      this.professoresRepository.find({
        where: {
          academia: {
            id: academiaId,
          },
        },
      }),
    );

    if (error) return [];

    return data;
  }

  async editar(dto: EditarProfessorDto) {
    const [data, error] = await async(
      this.professoresRepository.update(
        { id: dto.id },
        {
          nome: dto.nome,
          cpf: dto.cpf,
          rg: dto.rg,
          endereco: dto.endereco,
          numero: dto.numero,
          complemento: dto.complemento,
          bairro: dto.bairro,
          cep: dto.cep,
          estado: dto.estado,
          cidade: dto.cidade,
          email: dto.email,
          telefone: dto.telefone,
          telefoneResidencial: dto.telefoneResidencial,
          nascimento: dto.nascimento,
          status: dto.status,
          academia: {
            id: dto.academiaId,
          },
        },
      ),
    );

    if (error) return null;

    const [professor] = await async(
      this.professoresRepository.findOne({
        where: { id: dto.id },
      }),
    );

    return professor;
  }

  async deletar(id: string) {
    const [data, error] = await async(
      this.professoresRepository.softDelete({ id }),
    );

    return !error;
  }
}
