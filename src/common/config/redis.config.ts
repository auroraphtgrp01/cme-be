import { registerAs } from '@nestjs/config'
import validateConfig from '@/common/utils/validateConfig.utils'
import { IsInt, IsOptional, IsString, IsUrl, Max, Min, IsNumberString } from 'class-validator'
import { IRedisConfig } from '@/common/config/config.i'

class RedisConfigEnvironmentVariables {
  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  REDIS_PORT: number

  @IsUrl({ require_tld: false })
  @IsOptional()
  REDIS_HOST: string

  @IsString()
  @IsOptional()
  REDIS_PASSWORD: string

  @IsNumberString()
  @IsOptional()
  TTL: string

  @IsNumberString()
  @IsOptional()
  CACHE_MAX: string
}

const getEnvVariable = (
  variable: string,
  defaultValue: any,
  transform: (val: string) => any = (val: string) => val
) => {
  return process.env[variable] ? transform(process.env[variable]) : defaultValue
}
export default registerAs<IRedisConfig>('redis', () => {
  validateConfig(process.env, RedisConfigEnvironmentVariables)

  return {
    host: getEnvVariable('REDIS_HOST', 'http://localhost'),
    port: getEnvVariable('REDIS_PORT', 6379, (val: string) => parseInt(val, 10)),
    password: getEnvVariable('REDIS_PASSWORD', 'your_password_here'),
    ttl: getEnvVariable('TTL', 5, (val: string) => parseInt(val, 10)),
    max: getEnvVariable('CACHE_MAX', 10, (val: string) => parseInt(val, 10))
  }
})
