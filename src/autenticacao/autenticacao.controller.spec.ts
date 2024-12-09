import { Test, TestingModule } from '@nestjs/testing';
import { HttpResponse } from '../shared/classes/http-response';
import { AutenticacaoController } from './autenticacao.controller';
import { AutenticacaoService } from './autenticacao.service';

describe('AutenticacaoController', () => {
  let controller: AutenticacaoController;
  let service: AutenticacaoService;

  const mockAutenticacaoService = {
    login: jest.fn(),
    validateToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [AutenticacaoController],
      providers: [
        {
          provide: AutenticacaoService,
          useValue: mockAutenticacaoService,
        },
      ],
    }).compile();

    controller = module.get<AutenticacaoController>(AutenticacaoController);
    service = module.get<AutenticacaoService>(AutenticacaoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should login', async () => {
    jest.spyOn(service, 'login').mockReturnValue(Promise.resolve('token'));

    expect(await controller.login({ email: 'a', senha: 'a' })).toEqual(
      new HttpResponse('token').onLogin(),
    );
  });

  it('should validateToken', async () => {
    jest.spyOn(service, 'validateToken').mockReturnValue(true);

    expect(await controller.validateToken({ jwt: 'token' })).toEqual(true);
  });

  it('should not validateToken', async () => {
    jest.spyOn(service, 'validateToken').mockImplementation(() => {
      throw new Error();
    });

    expect(await controller.validateToken({ jwt: 'token' })).toEqual(false);
  });
});
