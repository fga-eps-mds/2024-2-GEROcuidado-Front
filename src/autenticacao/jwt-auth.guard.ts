import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../shared/decorators/public-route.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt-auth') {
  constructor(private readonly _reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this._reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    return isPublic ? true : super.canActivate(context);
  }

  handleRequest<JwtPayload>(
    err: unknown,
    user: JwtPayload,
    info: unknown,
    context: ExecutionContext,
  ) {
    if (!user) {
      throw new UnauthorizedException('Usuário não autenticado!');
    }

    return super.handleRequest(err, user, info, context);
  }
}
