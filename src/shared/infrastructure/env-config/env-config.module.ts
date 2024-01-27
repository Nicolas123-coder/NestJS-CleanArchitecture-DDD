import { DynamicModule, Module } from '@nestjs/common'
import { EnvConfigService } from './env-config.service'
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config'
import { join } from 'path'

@Module({
  imports: [ConfigModule],
  providers: [EnvConfigService],
  exports: [EnvConfigService],
})
export class EnvConfigModule extends ConfigModule {
  static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
    return super.forRoot({
      ...options, //? para garantir que as outras opções de env sejam aplicadas também
      envFilePath: [
        join(__dirname, `../../../../.env.${process.env.NODE_ENV}`),
      ],
    })
  }
}
