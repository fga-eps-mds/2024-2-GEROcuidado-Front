import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCheck() {
    return {
      message: 'GEROcuidadoApiUsuario health check Ok!',
      data: {},
    };
  }
}
