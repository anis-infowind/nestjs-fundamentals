import { Test, TestingModule } from '@nestjs/testing';
import { AlbumsResolver } from './albums.resolver';

describe('AlbumsResolver', () => {
  let resolver: AlbumsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlbumsResolver],
    }).compile();

    resolver = module.get<AlbumsResolver>(AlbumsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
