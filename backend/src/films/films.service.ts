import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from '../repository/repository';
import { FilmsResponseDto, ScheduleResponseDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly repository: Repository) {}

  getFilms(): Promise<FilmsResponseDto> {
    return this.repository.getFilms();
  }

  async getFilmsSchedule(id: string): Promise<ScheduleResponseDto> {
    const schedule = await this.repository.getFilmSchedule(id);

    if (!schedule) {
      throw new NotFoundException(`Film ${id} was not found`);
    }

    return schedule;
  }
}
