import { Inject, Injectable } from '@nestjs/common';
import { DevConfigService } from './common/providers/dev-config-service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private devConfigService: DevConfigService,
    @Inject('CONFIG')
    private config: { port: number },
    private configService: ConfigService
  ) {}
  getHello(): string {
    return `Hello I am learning Nest.js Fundamentals ${this.devConfigService.getDBHOST()} PORT = ${this.config.port}`;
  }

  getEnvVariables() {
    return {
      port: this.configService.get<number>("port"),
      node_env: this.configService.get<string>("NODE_ENV")
    };
  }
}
