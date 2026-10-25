import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { Repository } from './repository';

describe('Repository', () => {
  let provider: Repository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Repository, { provide: DataSource, useValue: {} }],
    }).compile();

    provider = module.get<Repository>(Repository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
