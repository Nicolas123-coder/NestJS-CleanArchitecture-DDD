import { Injectable } from '@nestjs/common'
import { EnvConfig } from './env-config.interface'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class EnvConfigService implements EnvConfig {
  //TODO: rodar essa linha de baixo no gpt pra entender oq faz
  constructor(private configService: ConfigService) {}

  getAppPort(): number {
    return Number(this.configService.get<number>('PORT'))
  }

  getNodeEnv(): string {
    return this.configService.get<string>('NODE_ENV')
  }
}
