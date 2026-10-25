import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  FilmDto,
  FilmsResponseDto,
  ScheduleDto,
  ScheduleResponseDto,
} from '../films/dto/films.dto';
import { Film } from './entities/film.entity';
import { Schedule } from './entities/schedule.entity';
import { FilmWithScheduleDto } from './film.schema';

function parseArray(value: unknown): string[] {
  if (value == null || value === '') {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (typeof value !== 'string') {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed.map(String);
    }

    return [String(parsed)];
  } catch {
    return [value];
  }
}

function filmToDto(film: Film): FilmDto {
  return {
    id: film.id,
    rating: film.rating,
    director: film.director,
    tags: parseArray(film.tags),
    title: film.title,
    about: film.about,
    description: film.description,
    image: film.image,
    cover: film.cover,
  };
}

function scheduleToDto(schedule: Schedule): ScheduleDto {
  return {
    id: schedule.id,
    daytime:
      schedule.daytime instanceof Date
        ? schedule.daytime.toISOString()
        : new Date(schedule.daytime).toISOString(),
    hall: String(schedule.hall),
    rows: schedule.rows,
    seats: schedule.seats,
    price: schedule.price,
    taken: parseArray(schedule.taken),
  };
}

@Injectable()
export class Repository {
  constructor(private readonly dataSource: DataSource) {}

  async getFilms(): Promise<FilmsResponseDto> {
    const films = await this.dataSource.getRepository(Film).find();

    return {
      total: films.length,
      items: films.map(filmToDto),
    };
  }

  async getFilmById(id: string): Promise<FilmDto | null> {
    const film = await this.dataSource.getRepository(Film).findOneBy({ id });

    return film ? filmToDto(film) : null;
  }

  async getFilmSchedule(id: string): Promise<ScheduleResponseDto | null> {
    const film = await this.dataSource.getRepository(Film).findOneBy({ id });

    if (!film) {
      return null;
    }

    const schedule = await this.dataSource.getRepository(Schedule).find({
      where: { filmId: id },
      order: { daytime: 'ASC' },
    });

    const items = schedule.map(scheduleToDto);

    return {
      total: items.length,
      items,
    };
  }

  async saveFilms(films: FilmWithScheduleDto[]): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const filmRepository = manager.getRepository(Film);
      const scheduleRepository = manager.getRepository(Schedule);

      await filmRepository.insert(
        films.map((film) => ({
          id: film.id,
          rating: film.rating,
          director: film.director,
          tags: JSON.stringify(film.tags),
          title: film.title,
          about: film.about,
          description: film.description,
          image: film.image,
          cover: film.cover,
        })),
      );

      const schedules = films.flatMap((film) =>
        film.schedule.map((schedule) => ({
          id: schedule.id,
          daytime: new Date(schedule.daytime),
          hall: Number(schedule.hall),
          rows: schedule.rows,
          seats: schedule.seats,
          price: schedule.price,
          taken: JSON.stringify(schedule.taken),
          filmId: film.id,
        })),
      );

      if (schedules.length > 0) {
        await scheduleRepository.insert(schedules);
      }
    });
  }

  async findSession(filmId: string, sessionId: string) {
    const film = await this.dataSource
      .getRepository(Film)
      .findOneBy({ id: filmId });

    if (!film) {
      return null;
    }

    const session = await this.dataSource
      .getRepository(Schedule)
      .findOneBy({ id: sessionId, filmId });

    return session ? scheduleToDto(session) : null;
  }

  async takeSeats(
    filmId: string,
    sessionId: string,
    keys: string[],
  ): Promise<boolean> {
    return this.dataSource.transaction(async (manager) => {
      const scheduleRepository = manager.getRepository(Schedule);

      const schedule = await scheduleRepository.findOne({
        where: { id: sessionId, filmId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!schedule) {
        return false;
      }

      const taken = parseArray(schedule.taken);
      const takenSeats = new Set(taken);

      if (keys.some((key) => takenSeats.has(key))) {
        return false;
      }

      schedule.taken = JSON.stringify([...taken, ...new Set(keys)]);

      await scheduleRepository.save(schedule);

      return true;
    });
  }
}
