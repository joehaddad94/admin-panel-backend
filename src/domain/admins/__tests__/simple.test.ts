import { Test, TestingModule } from '@nestjs/testing';

describe('Simple Test', () => {
  it('should work', () => {
    expect(true).toBe(true);
  });

  it('should create a simple service', async () => {
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
