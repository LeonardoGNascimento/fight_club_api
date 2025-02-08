import { Test, TestingModule } from '@nestjs/testing';
import { AgendaService } from './agenda.service';
import { PrismaService } from 'src/_core/prisma.service';
import { RedisService } from 'src/_core/redis.config';

describe('AgendaService', () => {
  let service: AgendaService;
  let prismaService: PrismaService;
  let redisService: RedisService;

  const mockPrismaService = {
    agendas: {
      findMany: jest.fn(),
    },
  };

  const mockRedisService = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgendaService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    service = module.get<AgendaService>(AgendaService);
    prismaService = module.get<PrismaService>(PrismaService);
    redisService = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('listar', () => {
    const academiaId = 'academia123';
    const mockAgendas = [
      {
        id: '1',
        dataInicio: new Date(),
        dataFinal: new Date(),
        tipo: 'regular',
        modalidade: { nome: 'Yoga' },
      },
    ];

    it('should return cached data when available', async () => {
      const cachedData = [{ id: '1', title: 'Cached' }];
      mockRedisService.get.mockResolvedValue(cachedData);

      const result = await service.listar(academiaId);

      expect(result).toEqual(cachedData);
      expect(mockRedisService.get).toHaveBeenCalledWith(`${academiaId}:agenda`);
      expect(mockPrismaService.agendas.findMany).not.toHaveBeenCalled();
    });

    it('should fetch and transform data from database when cache is empty', async () => {
      mockRedisService.get.mockResolvedValue(null);
      mockPrismaService.agendas.findMany.mockResolvedValue(mockAgendas);

      const result = await service.listar(academiaId);

      expect(result).toEqual([
        {
          ...mockAgendas[0],
          title: mockAgendas[0].modalidade.nome,
          start: mockAgendas[0].dataInicio,
          end: mockAgendas[0].dataFinal,
        },
      ]);
      expect(mockPrismaService.agendas.findMany).toHaveBeenCalledWith({
        include: { modalidade: true },
        where: {
          academiasId: academiaId,
          deleted: null,
        },
      });
      expect(mockRedisService.set).toHaveBeenCalledWith(
        `${academiaId}:agenda`,
        expect.any(Array),
        100000,
      );
    });

    it('should handle empty database results', async () => {
      mockRedisService.get.mockResolvedValue(null);
      mockPrismaService.agendas.findMany.mockResolvedValue([]);

      const result = await service.listar(academiaId);

      expect(result).toEqual([]);
      expect(mockRedisService.set).toHaveBeenCalledWith(
        `${academiaId}:agenda`,
        [],
        100000,
      );
    });
  });
});
