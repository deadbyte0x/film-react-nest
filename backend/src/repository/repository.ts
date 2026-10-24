import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  FilmDto,
  FilmsResponseDto,
  ScheduleResponseDto,
} from '../films/dto/films.dto';
import { FILM_MODEL, FilmEntity, FilmWithScheduleDto } from './film.schema';
import {
  filmDtoToEntity,
  filmEntityToDto,
  scheduleEntityToDto,
} from './film.converter';

@Injectable()
export class Repository {
  constructor(
    @InjectModel(FILM_MODEL) private readonly filmModel: Model<FilmEntity>,
  ) {}

  async getFilms(): Promise<FilmsResponseDto> {
    const films = await this.filmModel.find().exec();

    return {
      total: films.length,
      items: films.map(filmEntityToDto),
    };
  }

  async getFilmById(id: string): Promise<FilmDto | null> {
    const film = await this.filmModel.findOne({ id }).exec();
    return film ? filmEntityToDto(film) : null;
  }

  async getFilmSchedule(id: string): Promise<ScheduleResponseDto | null> {
    const film = await this.filmModel.findOne({ id }).exec();
    if (!film) {
      return null;
    }

    const items = (film.schedule ?? []).map(scheduleEntityToDto);
    return { total: items.length, items };
  }

  async saveFilms(films: FilmWithScheduleDto[]): Promise<void> {
    await this.filmModel.insertMany(films.map(filmDtoToEntity));
  }

  async findSession(filmId: string, sessionId: string) {
    const film = await this.filmModel.findOne({ id: filmId }).exec();
    if (!film) {
      return null;
    }
    const session = (film.schedule ?? []).find((s) => s.id === sessionId);

    return session ?? null;
  }

  async takeSeats(
    filmId: string,
    sessionId: string,
    keys: string[],
  ): Promise<boolean> {
    const result = await this.filmModel
      .updateOne(
        {
          id: filmId,
          schedule: {
            $elemMatch: { id: sessionId, taken: { $nin: keys } },
          },
        },
        { $push: { 'schedule.$.taken': { $each: keys } } },
      )
      .exec();

    return result.modifiedCount === 1;
  }
}
