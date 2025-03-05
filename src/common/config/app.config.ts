import { registerAs } from '@nestjs/config'
import validateConfig from '@/common/utils/validateConfig.utils'
import { IsEnum, IsInt, IsOptional, IsString, IsUrl, Max, Min } from 'class-validator'
import { EEnvironment, IAppConfig } from '@/common/config/config.i'

class EnvironmentVariablesValidator {
  @IsEnum(EEnvironment)
  @IsOptional()
  NODE_ENV?: EEnvironment

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  APP_PORT?: number

  @IsUrl({ require_tld: false })
  @IsOptional()
  FRONTEND_DOMAIN?: string

  @IsUrl({ require_tld: false })
  @IsOptional()
  BACKEND_DOMAIN?: string

  @IsString()
  @IsOptional()
  API_PREFIX?: string

  @IsString()
  @IsOptional()
  APP_FALLBACK_LANGUAGE?: string

  @IsString()
  @IsOptional()
  APP_HEADER_LANGUAGE?: string

  @IsString()
  @IsOptional()
  CAPTCHA_SOLVER_DOMAIN?: string
}

export default registerAs<IAppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator)

  const env = process.env
  return {
    nodeEnv: (env.NODE_ENV || 'development') as EEnvironment,
    name: env.APP_NAME || 'app',
    workingDirectory: env.PWD || process.cwd(),
    frontendDomain: env.FRONTEND_DOMAIN,
    backendDomain: env.BACKEND_DOMAIN ?? 'http://localhost',
    port: env.APP_PORT ? parseInt(env.APP_PORT, 10) : env.PORT ? parseInt(env.PORT, 10) : 3000,
    apiPrefix: env.API_PREFIX || 'api',
    fallbackLanguage: env.APP_FALLBACK_LANGUAGE || 'en',
    headerLanguage: env.APP_HEADER_LANGUAGE || 'x-custom-lang',
    captchaSolverDomain: env.CAPTCHA_SOLVER_DOMAIN || 'http://localhost:1234'
  }
})
