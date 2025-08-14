import { Test, TestingModule } from '@nestjs/testing';
import { Injectable } from '@nestjs/common';

describe('Simple Test', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should work', () => {
    expect(true).toBe(true);
  });

  it('should create a simple service', async () => {
    @Injectable()
    class SimpleService {
      getMessage() {
        return 'Hello World';
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [SimpleService],
    }).compile();

    const service = module.get<SimpleService>(SimpleService);
    expect(service.getMessage()).toBe('Hello World');
  });
});
