import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtPayload } from './interfaces/jwt.interface';
import { JwtStrategy } from './jwt.strategy';

class PublicJwtStrategy extends JwtStrategy {
  public validate(payload: any): Promise<any> {
    return super.validate(payload);
  }
}

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        {
          provide: JwtStrategy,
          useValue: {
            constructor: jest.fn(),
            validate: jest.fn(),
          },
        },
      ],
    }).compile();
    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
    expect(configService).toBeDefined();
  });

  it('should validate', async () => {
    const spy = jest
      .spyOn(configService, 'get')
      .mockReturnValue(
        'a0e47b13e1f3984172bf162aa2832ae6da4333c1881728d88c3792b29463d459',
      );

    const publicJwtStrategy = new PublicJwtStrategy(configService);
    const payload: JwtPayload = {
      exp: 0,
      iat: 0,
      id: 1,
      nome: 'zé',
      email: 'ze@email.com',
      admin: false,
    };
    const returned = { ...payload };

    expect(await publicJwtStrategy.validate(payload)).toEqual(returned);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
