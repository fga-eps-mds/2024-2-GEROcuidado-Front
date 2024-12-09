import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UsuarioService } from '../usuario/usuario.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AutenticacaoService {
  constructor(
    private readonly _usuarioService: UsuarioService,
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
  ) {}

  async login({ email, senha }: LoginDto): Promise<string> {
    const userFound = await this._usuarioService.findByEmail(email);

    if (!userFound) {
      throw new BadRequestException('Este email não está cadastrado!');
    }

    await this.verifyPassword(senha, userFound.senha);

    const JwtPayload = {
      id: userFound.id,
      email: userFound.email,
      nome: userFound.nome,
      admin: userFound.admin,
    };

    const expiresIn = this._configService.get('JWT_TOKEN_EXPIRES_IN');

    return this._jwtService.sign(JwtPayload, { expiresIn });
  }

  private async verifyPassword(senha: string, hash: string) {
    // TODO a senha deve vir do front como um base64
    const isMatch = await bcrypt.compare(senha, hash);

    if (!isMatch) {
      throw new UnauthorizedException('Senha incorreta!');
    }
  }

  validateToken(jwt: string) {
    return this._jwtService.verify(jwt);
  }
}
