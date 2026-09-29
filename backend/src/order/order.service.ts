import {
  BadRequestException,
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/order.dto';
import { Repository } from '../repository/repository';

@Injectable()
export class OrderService {
  constructor(private readonly repository: Repository) {}

  async createOrder(dto: CreateOrderDto) {
    const seen = new Set<string>();

    for (const ticket of dto.tickets) {
      const key = `${ticket.film}|${ticket.session}|${ticket.row}:${ticket.seat}`;
      if (seen.has(key)) {
        throw new BadRequestException(
          `Место ${ticket.row}:${ticket.seat} указано в заказе дважды`,
        );
      }
      seen.add(key);
    }

    for (const ticket of dto.tickets) {
      const session = await this.repository.findSession(
        ticket.film,
        ticket.session,
      );
      if (!session) {
        throw new NotFoundException('Фильм или сеанс не найден');
      }

      if (
        ticket.row < 1 ||
        ticket.row > session.rows ||
        ticket.seat < 1 ||
        ticket.seat > session.seats
      ) {
        throw new BadRequestException(
          `Места ${ticket.row}:${ticket.seat} нет в зале`,
        );
      }

      if (session.taken.includes(`${ticket.row}:${ticket.seat}`)) {
        throw new ConflictException(
          `Место ${ticket.row}:${ticket.seat} уже занято`,
        );
      }
    }

    const bySession = new Map<
      string,
      { filmId: string; sessionId: string; keys: string[] }
    >();

    for (const ticket of dto.tickets) {
      const mapKey = `${ticket.film}|${ticket.session}`;
      const entry = bySession.get(mapKey) ?? {
        filmId: ticket.film,
        sessionId: ticket.session,
        keys: [],
      };
      entry.keys.push(`${ticket.row}:${ticket.seat}`);
      bySession.set(mapKey, entry);
    }

    for (const { filmId, sessionId, keys } of bySession.values()) {
      const ok = await this.repository.takeSeats(filmId, sessionId, keys);
      if (!ok) {
        throw new ConflictException(
          `Одно из мест уже занято: ${keys.join(', ')}`,
        );
      }
    }

    return { total: dto.tickets.length, items: dto.tickets };
  }
}
