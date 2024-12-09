import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import bcrypt from 'bcrypt';
import { UsuarioService } from '../usuario/usuario.service';
import { AutenticacaoService } from './autenticacao.service';

describe('AutenticacaoService', () => {
  let service: AutenticacaoService;
  let usuarioService: UsuarioService;
  let configService: ConfigService;
  let jwtService: JwtService;

  const mockUsuarioService = {
    findByEmail: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutenticacaoService,
        { provide: UsuarioService, useValue: mockUsuarioService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AutenticacaoService>(AutenticacaoService);
    usuarioService = module.get<UsuarioService>(UsuarioService);
    configService = module.get<ConfigService>(ConfigService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should not login - no email found', async () => {
    jest.spyOn(usuarioService, 'findByEmail').mockReturnValue(undefined as any);

    expect(service.login({ email: 'a', senha: '1' })).rejects.toThrow(
      new BadRequestException('Este email não está cadastrado!'),
    );
  });

  it('should not login - wrong password', async () => {
    jest.spyOn(usuarioService, 'findByEmail').mockReturnValue('a' as any);
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation((pass: string | Buffer, hash: string) =>
        Promise.resolve(false),
      );

    expect(service.login({ email: 'a', senha: '1' })).rejects.toThrow(
      new UnauthorizedException('Senha incorreta!'),
    );
  });

  it('should login', async () => {
    jest.spyOn(configService, 'get').mockReturnValue('12h');
    jest.spyOn(jwtService, 'sign').mockReturnValue('token');
    jest.spyOn(usuarioService, 'findByEmail').mockReturnValue('a' as any);
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation((pass: string | Buffer, hash: string) =>
        Promise.resolve(true),
      );

    expect(await service.login({ email: 'a', senha: '1' })).toEqual('token');
  });

  it('should validate token', () => {
    jest.spyOn(jwtService, 'verify').mockReturnValue(true as any);

    expect(service.validateToken('token')).toEqual(true);
  });
});
