import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { HttpResponse } from '../shared/classes/http-response';
import { PublicRoute } from '../shared/decorators/public-route.decorator';
import { Response } from '../shared/interceptors/data-transform.interceptor';
import { AutenticacaoService } from './autenticacao.service';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AutenticacaoController {
  constructor(private readonly _service: AutenticacaoService) {}

  @Post('login')
  @PublicRoute()
  @HttpCode(200)
  async login(@Body() body: LoginDto): Promise<Response<string>> {
    const jwtToken = await this._service.login(body);
    return new HttpResponse<string>(jwtToken).onLogin();
  }

  @MessagePattern({ role: 'auth', cmd: 'check' })
  async validateToken(data: { jwt: string }) {
    try {
      return this._service.validateToken(data.jwt);
    } catch (error) {
      return false;
    }
  }
}
