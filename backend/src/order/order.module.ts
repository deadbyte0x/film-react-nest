import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Repository } from 'src/repository/repository';
import { MongooseModule } from '@nestjs/mongoose';
import { FILM_MODEL, filmSchema } from 'src/repository/film.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: FILM_MODEL,
        schema: filmSchema,
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, Repository],
})
export class OrderModule {}
