import { INestApplication } from '@nestjs/common';
import { ExpressAdapter } from '@bull-board/express';
import { Queue } from 'bullmq';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

export function BullMQSetup(app: INestApplication): void {
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/bull-admin');
  const aQueue = app.get<Queue>(`BullQueue_getDistance`);
  const bQueue = app.get<Queue>(`BullQueue_getDistanceBetweenLocation`);
  createBullBoard({
    queues: [new BullMQAdapter(aQueue), new BullMQAdapter(bQueue)],
    serverAdapter,
  });
  app.use('/bull-admin', serverAdapter.getRouter());
}
