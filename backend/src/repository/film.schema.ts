import { Schema } from 'mongoose';
import { FilmDto, ScheduleDto } from '../films/dto/films.dto';

export const FILM_MODEL = 'Film';

export type ScheduleEntity = ScheduleDto;

export interface FilmEntity extends FilmDto {
  schedule: ScheduleEntity[];
}

export interface FilmWithScheduleDto extends FilmDto {
  schedule: ScheduleDto[];
}

const scheduleSchema = new Schema<ScheduleEntity>(
  {
    id: { type: String, required: true },
    daytime: { type: String, required: true },
    hall: { type: String, required: true },
    rows: { type: Number, required: true },
    seats: { type: Number, required: true },
    price: { type: Number, required: true },
    taken: { type: [String], default: [] },
  },
  { _id: false },
);

export const filmSchema = new Schema<FilmEntity>(
  {
    id: { type: String, required: true, unique: true, index: true },
    rating: { type: Number, required: true },
    director: { type: String, required: true },
    tags: { type: [String], default: [] },
    title: { type: String, required: true },
    about: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    cover: { type: String, required: true },
    schedule: { type: [scheduleSchema], default: [] },
  },
  { collection: 'films', versionKey: false },
);
