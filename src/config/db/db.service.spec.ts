import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DbService } from './db.service';

describe('DbService', () => {
  let service: DbService;
  let configService: ConfigService;

  const mockConfigService = {
    get(key: string) {
      switch (key) {
        case 'DB_HOST':
          return 'localhost';
        case 'DB_USERNAME':
          return 'username';
        case 'DB_PASS':
          return 'password';
        case 'DB_DATABASE':
          return 'public';
        case 'DB_PORT':
          return 5001;
        default:
          return null;
      }
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DbService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<DbService>(DbService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return db config development', async () => {
    jest.spyOn(configService, 'get').mockReturnValue(undefined);

    process.env.NODE_ENV = 'development';

    const host = 'localhost';
    const logging = false;
    const username = 'username';
    const password = 'password';
    const database = 'public';
    const port = 5001;
    const synchronize = false;
    const dbconfig = {
      type: 'postgres',
      host,
      logging,
      port,
      username,
      password,
      database,
      autoLoadEntities: true,
      synchronize,
    };

    expect(await service.createTypeOrmOptions()).toEqual(dbconfig);
  });

  it('should return db config production', async () => {
    jest.spyOn(configService, 'get').mockReturnValue(undefined);

    process.env.NODE_ENV = 'production';

    const host = 'localhost';
    const logging = false;
    const username = 'username';
    const password = 'password';
    const database = 'public';
    const port = 5001;
    const synchronize = false;
    const dbconfig = {
      type: 'postgres',
      host,
      logging,
      port,
      username,
      password,
      database,
      autoLoadEntities: true,
      synchronize,
    };

    expect(await service.createTypeOrmOptions()).toEqual(dbconfig);
  });
});
