import { PartialType } from '@nestjs/mapped-types';
import { CriarTurmaDto } from './criarTurma.dto';

export class AtualizarTurmaDto extends PartialType(CriarTurmaDto) {
  id: string;
}
