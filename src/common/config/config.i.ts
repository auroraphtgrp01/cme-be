export interface IAppConfig {
  nodeEnv: EEnvironment
  name: string
  frontendDomain?: string
  backendDomain: string
  port: number
  fallbackLanguage?: string
  headerLanguage?: string
  captchaSolverDomain: string
}

export interface IRedisConfig {
  host: string
  port: number
  password: string
  ttl: number
  max: number
}

export enum EEnvironment {
  Development = 'development',
  Production = 'production',
  Test = 'test'
}

export interface IAllConfigType {
  app: IAppConfig
}
