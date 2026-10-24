import { FilmDto, ScheduleDto } from '../films/dto/films.dto';
import { FilmEntity, FilmWithScheduleDto, ScheduleEntity } from './film.schema';

export function filmDtoToEntity(film: FilmWithScheduleDto): FilmEntity {
  return {
    id: film.id,
    rating: film.rating,
    director: film.director,
    tags: [...film.tags],
    title: film.title,
    about: film.about,
    description: film.description,
    image: film.image,
    cover: film.cover,
    schedule: film.schedule.map(scheduleDtoToEntity),
  };
}

export function filmEntityToDto(film: FilmEntity): FilmDto {
  return {
    id: film.id,
    rating: film.rating,
    director: film.director,
    tags: [...film.tags],
    title: film.title,
    about: film.about,
    description: film.description,
    image: film.image,
    cover: film.cover,
  };
}

export function scheduleDtoToEntity(schedule: ScheduleDto): ScheduleEntity {
  return {
    id: schedule.id,
    daytime: schedule.daytime,
    hall: String(schedule.hall),
    rows: schedule.rows,
    seats: schedule.seats,
    price: schedule.price,
    taken: [...schedule.taken],
  };
}

export function scheduleEntityToDto(schedule: ScheduleEntity): ScheduleDto {
  return {
    id: schedule.id,
    daytime: schedule.daytime,
    hall: String(schedule.hall),
    rows: schedule.rows,
    seats: schedule.seats,
    price: schedule.price,
    taken: [...schedule.taken],
  };
}
