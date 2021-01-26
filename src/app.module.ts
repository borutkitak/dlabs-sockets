import { Module } from '@nestjs/common';
import { OrderGateway } from './order.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [OrderGateway],
})
export class AppModule {}
