import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { OrderParams, Ordering } from '../shared/decorators/ordenate.decorator';
import {
  Pagination,
  PaginationParams,
} from '../shared/decorators/paginate.decorator';
import { Usuario } from './entities/usuario.entity';
import { UsuarioService } from './usuario.service';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let repository: Repository<Usuario>;
  let configService: ConfigService;

  const mockRepository = {
    save: jest.fn(),
    findOneOrFail: jest.fn(),
    remove: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    })),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockRepository,
        },
        UsuarioService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    repository = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create Usuario', async () => {
    const user = { nome: 'Henrique' } as any;
    jest.spyOn(repository, 'save').mockReturnValue({ id: 1 } as any);
    jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
      where: () => ({
        addSelect: () => ({
          getOne: jest.fn().mockResolvedValueOnce(undefined),
        }),
      }),
    } as any);
    jest.spyOn(configService, 'get').mockReturnValue(10 as any);
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation((pass: string | Buffer, salt: string | number) =>
        Promise.resolve('senha'),
      );
    const created = await service.create(user);
    expect(created.id).toEqual(1);
  });

  it('should not create Usuario', async () => {
    const user = { nome: 'Henrique' } as any;
    jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
      where: () => ({
        addSelect: () => ({
          getOne: jest
            .fn()
            .mockResolvedValueOnce({ email: 'fulano@gmail.com' } as any),
        }),
      }),
    } as any);
    expect(service.create(user)).rejects.toThrow(
      new BadRequestException('Este email já está cadastrado!'),
    );
  });

  it('should find Usuario', async () => {
    jest.spyOn(repository, 'findOneOrFail').mockReturnValue({ id: 1 } as any);

    const found = await service.findOne(1);
    expect(found.id).toEqual(1);
  });

  it('should find Usuario with foto', async () => {
    jest.spyOn(repository, 'findOneOrFail').mockReturnValue({
      id: 1,
      foto: Buffer.from('/9j/4AAQSkZJRgABAQAAAQABAAD', 'utf-8'),
    } as any);

    const found = await service.findOne(1, true);
    expect(found.id).toEqual(1);
  });

  it('should remove Usuario', async () => {
    jest.spyOn(repository, 'findOneOrFail').mockReturnValue({ id: 1 } as any);
    jest.spyOn(repository, 'remove').mockReturnValue({ id: 1 } as any);

    const removed = await service.remove(1);
    expect(removed.id).toEqual(1);
  });

  it('should update Usuario', async () => {
    jest.spyOn(repository, 'findOneOrFail').mockReturnValue({ id: 1 } as any);
    jest
      .spyOn(repository, 'save')
      .mockReturnValue({ id: 1, nome: 'Henrique' } as any);

    const found = await service.update(1, { nome: 'Henrique' });
    expect(found).toEqual({ id: 1, nome: 'Henrique' });
  });

  it('should update Usuario with photo', async () => {
    jest.spyOn(repository, 'findOneOrFail').mockReturnValue({ id: 1 } as any);
    jest
      .spyOn(repository, 'save')
      .mockReturnValue({ id: 1, nome: 'Henrique', foto: '1' } as any);

    const found = await service.update(1, { nome: 'Henrique' });
    expect(found).toEqual({
      id: 1,
      nome: 'Henrique',
      foto: 'data:image/png;base64,1',
    });
  });

  describe('findAll', () => {
    const usuario = {
      id: 1,
      nome: 'Henrique',
      email: 'email@email.com',
    };

    const order: OrderParams = {
      column: 'id',
      dir: 'ASC',
    };
    const ordering: Ordering = new Ordering(JSON.stringify(order));

    const paginate: PaginationParams = {
      limit: 10,
      offset: 0,
    };
    const pagination: Pagination = new Pagination(paginate);

    it('should findAll Usuario', async () => {
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        where: () => ({
          limit: () => ({
            offset: () => ({
              orderBy: () => ({
                getManyAndCount: jest
                  .fn()
                  .mockResolvedValueOnce([[usuario], 1]),
              }),
            }),
          }),
        }),
      } as any);

      const { data, count } = await service.findAll({}, ordering, pagination);
      expect(count).toEqual(1);
      expect((data as Usuario[])[0]).toEqual(usuario);
    });
  });

  describe('findAllToPublicacao', () => {
    const usuario = {
      id: 1,
      nome: 'Henrique',
      email: 'email@email.com',
      foto: '1',
    };

    it('should findAllToPublicacao', async () => {
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        where: () => ({
          getMany: jest.fn().mockResolvedValueOnce([usuario]),
        }),
      } as any);

      const expectedUser = {
        ...usuario,
        foto: 'data:image/png;base64,1',
      };

      const data = await service.findAllToPublicacao([1]);
      expect(data).toEqual([expectedUser]);
    });
  });
});
