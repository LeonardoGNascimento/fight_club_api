import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as PdfPrinter from 'pdfmake';
import {
  ExamesGraduacao,
  StatusExame,
} from 'src/_core/entity/exames-graduacao.entity';
import { ExamesGraducaoAlunos } from 'src/_core/entity/exames-graducao-alunos.entity';
import { AlunosService } from 'src/alunos/alunos.service';
import { ModalidadesService } from 'src/modalidades/modalidades.service';
import { Repository } from 'typeorm';
import * as puppeteer from 'puppeteer';

@Injectable()
export class ExameService {
  constructor(
    @InjectRepository(ExamesGraduacao)
    private examesGraduacaoRepository: Repository<ExamesGraduacao>,
    @InjectRepository(ExamesGraducaoAlunos)
    private examesGraducaoAlunosRepository: Repository<ExamesGraducaoAlunos>,
    private alunosService: AlunosService,
    private modalidadeService: ModalidadesService,
  ) {}

  gerarHtmlRelatorio(alunos: any[]) {
    const rows = alunos
      .map(
        (a) => `
      <tr>
        <td>${a.aluno}</td>
        <td>${a.graduacaoAtual.nome}</td>
        <td>${a.graduacaoPretendida.nome}</td>
        <td class="${a.status === 'aprovado' ? 'aprovado' : 'reprovado'}">${a.status.toUpperCase()}</td>
      </tr>
    `,
      )
      .join('');

    return `
  <html>
    <head>
      <style>
        .flex {
          display: flex;
        }
        body {
          font-family: Arial, sans-serif;
          margin: 40px;
        }
        h1 {
          text-align: center;
          margin-bottom: 40px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 12px;
          border: 1px solid #ccc;
          text-align: left;
        }
        th {
          background-color: #f5f5f5;
        }
        .aprovado {
          color: green;
          font-weight: bold;
        }
        .reprovado {
          color: red;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="flex">
        <h1>Relatório de Exame de Faixa Karatê-do para a vida</h1>
        <img src='http://rotuclin-minio-bf124c-69-62-86-212.traefik.me:9000/public/logo_projeto.png'/>
      </div>

      <table>
        <thead>
          <tr>
            <th>Nome do Aluno</th>
            <th>Graduação Atual</th>
            <th>Graduação Pretendida</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </body>
  </html>
  `;
  }

  async gerarPdf(alunos: any) {
    const html = this.gerarHtmlRelatorio(alunos);
    const browser = await puppeteer.launch({
      executablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
      // headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // ESSENCIAL
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '10mm',
        right: '10mm',
      },
    });

    await browser.close();
    return pdfBuffer;
  }

  async listar() {
    return await this.examesGraduacaoRepository.find({
      relations: {
        modalidade: true,
      },
    });
  }

  async buscar(id: string) {
    const exame = await this.examesGraduacaoRepository.findOne({
      relations: {
        modalidade: {
          graduacoes: true,
          alunosModalidades: {
            aluno: true,
            graduacao: true,
          },
        },
        alunosExamesGraducoes: {
          aluno: true,
          graduacaoAtual: true,
          graduacaoPretendida: true,
        },
      },
      where: {
        id,
      },
    });

    return exame;
  }

  async criar(body: any) {
    const exame = await this.examesGraduacaoRepository.save({
      dataAgendamento: body.dataAgendamento,
      modalidade: {
        id: body.modalidadeId,
      },
    });

    const alunos = await this.modalidadeService.listarAlunos(body.modalidadeId);

    if (alunos && Array.isArray(alunos)) {
      await Promise.all(
        alunos.map(async (item) => {
          const aluno = await this.alunosService.buscar(item.id);

          const modalidade = aluno.modalidades.find(
            (item2) => item2.modalidade.id === body.modalidadeId,
          );

          const graduacaoAtual = modalidade.graduacao.id;
          const modalidadeAtual = await this.modalidadeService.find(
            body.modalidadeId,
          );

          const graduacaoPretendida =
            modalidadeAtual.graduacoes.find(
              (item) => item.ordem === modalidade.graduacao.ordem + 1,
            )?.id || null;

          if (!graduacaoPretendida) {
            return;
          }

          return this.examesGraducaoAlunosRepository.save({
            aluno: {
              id: aluno.id,
            },
            examesGraduacao: {
              id: exame.id,
            },
            graduacaoAtual: {
              id: graduacaoAtual,
            },
            graduacaoPretendida: {
              id: graduacaoPretendida,
            },
          });
        }),
      );
    }

    return exame;
  }

  async atualizar(exameId: string, body: any) {
    if (!body.alunos || !Array.isArray(body.alunos)) {
      throw new Error('Array de alunos é obrigatório.');
    }

    const resultados = [];

    for (const alunoData of body.alunos) {
      const { alunoId, status } = alunoData;

      if (!alunoId || !status) {
        throw new Error('Aluno e status são obrigatórios para cada aluno.');
      }

      const exameAluno = await this.examesGraducaoAlunosRepository.findOne({
        relations: {
          aluno: true,
          graduacaoAtual: true,
          graduacaoPretendida: {
            modalidade: true,
          },
        },
        where: {
          aluno: { id: alunoId },
          examesGraduacao: { id: exameId },
        },
      });

      if (!exameAluno) {
        throw new Error(`Exame do aluno não encontrado.`);
      }

      if (status === 'aprovado') {
        this.alunosService.atualizarGraduacao({
          graduacaoId: exameAluno.graduacaoPretendida.id,
          id: alunoId,
          modalidadeId: exameAluno.graduacaoPretendida.modalidade.id,
        });
      }

      exameAluno.status = status;
      const exameAlunoAtualizado =
        await this.examesGraducaoAlunosRepository.save(exameAluno);

      resultados.push({
        ...exameAlunoAtualizado,
        aluno: exameAluno.aluno.nome,
      });
    }

    await this.examesGraduacaoRepository.update(
      { id: exameId },
      {
        status: StatusExame.finalizado,
      },
    );

    return await this.gerarPdf(resultados);
  }
}
