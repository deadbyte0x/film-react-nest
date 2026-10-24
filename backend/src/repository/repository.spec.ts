import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { FILM_MODEL } from './film.schema';
import { Repository } from './repository';

describe('Repository', () => {
  let provider: Repository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Repository,
        { provide: getModelToken(FILM_MODEL), useValue: {} },
      ],
    }).compile();

    provider = module.get<Repository>(Repository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
