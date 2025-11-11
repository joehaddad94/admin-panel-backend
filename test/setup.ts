// Global test setup file
import 'reflect-metadata';

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.VERIFY_CLIENT_URL = 'https://test.example.com/verify';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-purposes-only';

// Global Jest configuration
beforeAll(() => {
  // Set up any global test configurations
  jest.setTimeout(10000);
});

afterAll(() => {
  // Clean up any global test configurations
});

// Global mocks for external dependencies
jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('test-salt'),
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockResolvedValue(true),
}));

// Mock crypto module with proper hoisting
const mockRandomFillSync = jest
  .fn()
  .mockReturnValue(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]));
const mockRandomBytes = jest.fn().mockReturnValue({
  toString: jest.fn().mockReturnValue('test-token-base64'),
});
const mockCreateHash = jest.fn().mockReturnValue({
  update: jest.fn().mockReturnThis(),
  digest: jest.fn().mockReturnValue('mock-hash'),
});

jest.mock('crypto', () => ({
  randomFillSync: mockRandomFillSync,
  randomBytes: mockRandomBytes,
  createHash: mockCreateHash,
}));

// Mock date-fns to return consistent dates in tests
jest.mock('date-fns', () => ({
  format: jest.fn().mockReturnValue('01-01-23'),
}));

// Suppress console logs during tests unless explicitly needed
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  // Suppress console output during tests
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterEach(() => {
  // Restore console output after tests
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Global error handler for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
