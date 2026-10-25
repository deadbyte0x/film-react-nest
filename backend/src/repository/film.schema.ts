import { FilmDto, ScheduleDto } from '../films/dto/films.dto';

export const FILM_MODEL = 'Film';

export type ScheduleEntity = ScheduleDto;

export interface FilmEntity extends FilmDto {
  schedule: ScheduleEntity[];
}

export interface FilmWithScheduleDto extends FilmDto {
  schedule: ScheduleDto[];
}
