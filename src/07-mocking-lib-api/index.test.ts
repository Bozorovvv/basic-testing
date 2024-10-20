import axios, { AxiosInstance } from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: jest.fn((fn) => {
    const throttledFn = (...args: unknown[]) => fn(...args);
    throttledFn.cancel = jest.fn();
    throttledFn.flush = jest.fn();
    return throttledFn;
  }),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

const createMockAxiosInstance = (mockGet: jest.Mock): AxiosInstance => {
  return {
    get: mockGet,
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
    head: jest.fn(),
    options: jest.fn(),
    request: jest.fn(),
    getUri: jest.fn(),
    defaults: {},
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn(), clear: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn(), clear: jest.fn() },
    },
  } as unknown as AxiosInstance;
};

describe('throttledGetDataFromApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create instance with provided base url', async () => {
    const mockGet = jest.fn().mockResolvedValue({ data: {} });
    const mockCreate = jest
      .fn()
      .mockReturnValue(createMockAxiosInstance(mockGet));
    mockedAxios.create = mockCreate;

    await throttledGetDataFromApi('/test');

    expect(mockCreate).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const mockGet = jest.fn().mockResolvedValue({ data: {} });
    mockedAxios.create.mockReturnValue(createMockAxiosInstance(mockGet));

    await throttledGetDataFromApi('/users');

    expect(mockGet).toHaveBeenCalledWith('/users');
  });

  test('should return response data', async () => {
    const mockData = { id: 1, name: 'John Doe' };
    const mockGet = jest.fn().mockResolvedValue({ data: mockData });
    mockedAxios.create.mockReturnValue(createMockAxiosInstance(mockGet));

    const result = await throttledGetDataFromApi('/users/1');

    expect(result).toEqual(mockData);
  });

  test('should be a throttled function', () => {
    expect(typeof throttledGetDataFromApi).toBe('function');
    expect(throttledGetDataFromApi).toHaveProperty('cancel');
    expect(throttledGetDataFromApi).toHaveProperty('flush');
  });

  test('should handle network errors', async () => {
    const errorMessage = 'Network Error';
    const mockGet = jest.fn().mockRejectedValue(new Error(errorMessage));
    mockedAxios.create.mockReturnValue(createMockAxiosInstance(mockGet));

    await expect(throttledGetDataFromApi('/error')).rejects.toThrow(
      errorMessage,
    );
  });
});
