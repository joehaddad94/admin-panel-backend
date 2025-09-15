# Testing Guide

This directory contains the testing configuration and setup for the SEF Admin Panel Server.

## Test Structure

```
test/
├── jest-e2e.json          # End-to-end test configuration
├── jest-unit.json         # Unit test configuration
├── setup.ts               # Global test setup and mocks
└── README.md              # This file
```

## Running Tests

### Unit Tests
```bash
# Run all unit tests
npm run test:unit

# Run unit tests in watch mode
npm run test:unit -- --watch

# Run unit tests with coverage
npm run test:unit -- --coverage

# Run specific test file
npm run test:unit -- admin.service.spec.ts

# Run tests matching a pattern
npm run test:unit -- --testNamePattern="AdminService"
```

### All Tests
```bash
# Run all tests (unit + e2e)
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

### End-to-End Tests
```bash
# Run e2e tests
npm run test:e2e
```

## Test Organization

### Unit Tests
Unit tests are co-located with the source code in `__tests__` folders:

```
src/domain/admins/
├── __tests__/
│   ├── admin.controller.spec.ts
│   ├── admin.mediator.spec.ts
│   ├── admin.service.spec.ts
│   ├── admin.repository.spec.ts
│   └── __mocks__/
│       └── admin.factory.ts
├── admin.controller.ts
├── admin.mediator.ts
├── admin.service.ts
└── admin.repository.ts
```

### Test Factories
Test factories are located in `__mocks__` folders and provide reusable test data:

```typescript
import { AdminFactory } from './__mocks__/admin.factory';

const mockAdmin = AdminFactory.createMockAdmin();
const mockAdminList = AdminFactory.createMockAdminList(5);
```

## Writing Tests

### Test File Structure
Each test file should follow this structure:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { ServiceName } from './service.name';

describe('ServiceName', () => {
  let service: ServiceName;
  let mockDependency: MockDependency;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceName,
        {
          provide: DependencyToken,
          useValue: mockDependency,
        },
      ],
    }).compile();

    service = module.get<ServiceName>(ServiceName);
    mockDependency = module.get<MockDependency>(DependencyToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('methodName', () => {
    it('should do something', async () => {
      // Test implementation
    });
  });
});
```

### Mocking Dependencies
Use Jest mocks for external dependencies:

```typescript
const mockService = {
  method: jest.fn(),
  anotherMethod: jest.fn(),
};

// In beforeEach
{
  provide: ServiceToken,
  useValue: mockService,
}
```

### Testing Async Operations
Always test async operations properly:

```typescript
it('should handle async operation', async () => {
  mockService.method.mockResolvedValue(result);
  
  const response = await service.method();
  
  expect(response).toEqual(expectedResult);
  expect(mockService.method).toHaveBeenCalledWith(expectedParams);
});
```

### Testing Error Cases
Test both success and error scenarios:

```typescript
it('should throw error when validation fails', async () => {
  mockService.method.mockRejectedValue(new Error('Validation failed'));
  
  await expect(service.method()).rejects.toThrow('Validation failed');
});
```

## Test Configuration

### Jest Unit Test Config
- **Root Directory**: `src/`
- **Test Pattern**: `*.spec.ts`
- **Coverage**: Excludes test files and mocks
- **Timeout**: 10 seconds
- **Environment**: Node.js

### Global Setup
The `setup.ts` file provides:
- Environment variable mocking
- Global dependency mocks (bcrypt, crypto, date-fns)
- Console output suppression during tests
- Error handling for unhandled rejections

## Best Practices

1. **Test Isolation**: Each test should be independent and not affect others
2. **Mock External Dependencies**: Don't test external libraries, mock them
3. **Test Edge Cases**: Include tests for error conditions and boundary cases
4. **Descriptive Test Names**: Use clear, descriptive names for test cases
5. **Arrange-Act-Assert**: Structure tests with clear setup, execution, and verification
6. **Coverage**: Aim for high test coverage but focus on meaningful tests
7. **Fast Execution**: Keep tests fast by using mocks and avoiding real I/O

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure test files can resolve imports correctly
2. **Mock Issues**: Check that mocks are properly configured in setup files
3. **Timeout Errors**: Increase timeout in Jest config if needed
4. **Coverage Issues**: Verify that coverage exclusions are correct

### Debug Mode
Run tests in debug mode to troubleshoot issues:

```bash
npm run test:debug
```

This will pause execution and allow you to inspect the test environment.

