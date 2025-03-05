import { PrismaClient, Prisma } from '@prisma/client';
import { createSoftDeleteExtension } from 'prisma-extension-soft-delete';
import { Logger } from '@nestjs/common';

const logger = new Logger('PrismaMiddleware');

const loggingExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    query: {
      async $allOperations({ args, operation, query, model }) {
        const before = Date.now();
        logger.verbose(
          `Operation: ${operation} on model: ${model} with args: ${JSON.stringify(args)}`
        );
        const result = await query(args);
        const after = Date.now();
        logger.verbose(
          `Operation: ${operation} on model: ${model} took ${after - before}ms`
        );
        return result;
      },
    },
  });
});

export const extendedPrismaClient = new PrismaClient()
  .$extends(loggingExtension)
  .$extends({
    model: {
      $allModels: {
        async hardDelete(args) {
          // Use Prisma's `delete` method directly
          return this.delete(args);
        },
        async hardDeleteMany(args) {
          // Use Prisma's `deleteMany` method directly
          return this.deleteMany(args);
        },
      },
    },
  })
  .$extends(
    createSoftDeleteExtension({
      models: {
        // Add other models if needed
      },
      defaultConfig: {
        field: 'deletedAt',
        createValue: (deleted) => {
          if (deleted) return new Date();
          return null;
        },
      },
    })
  );

export type ExtendedPrismaClient = typeof extendedPrismaClient;
