import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PublicRoute } from './shared/decorators/public-route.decorator';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @Get('health-check')
  @PublicRoute()
  healthCheck() {
    return this.service.healthCheck();
  }
}
