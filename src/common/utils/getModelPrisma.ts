import { Prisma } from '@prisma/client'

export const getModelPrisma = () => {
  return Prisma.dmmf.datamodel.models.map((model) => model.name)
}

export const isModelOfPrisma = (modelName: string | string[]) => {
  const models = getModelPrisma()
  const modelArray = Array.isArray(modelName) ? modelName : [modelName]

  const invalidModels = modelArray.filter((item) => !models.some((model) => model.toLowerCase() === item.toLowerCase()))

  return {
    isValid: invalidModels.length === 0,
    invalidModels
  }
}
