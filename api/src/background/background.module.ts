import { Module } from '@nestjs/common';
import { EmailQueueModule } from './queues/email-queue/email-queue.module';
import { SchedulerModule } from '../scheduler/scheduler.module';
@Module({
  imports: [EmailQueueModule, SchedulerModule],
})
export class BackgroundModule { }
