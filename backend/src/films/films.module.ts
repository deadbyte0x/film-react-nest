import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

import { Repository } from '../repository/repository';
import { FILM_MODEL, filmSchema } from '../repository/film.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: FILM_MODEL,
        schema: filmSchema,
      },
    ]),
  ],

  controllers: [FilmsController],

  providers: [FilmsService, Repository],
})
export class FilmsModule {}
