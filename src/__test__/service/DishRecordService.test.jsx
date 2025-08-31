import { describe, test, expect, vi, beforeEach } from 'vitest';
import baseApi from '../../service/baseApi';
import DishRecordService from '../../service/DishRecordService';

// Mock the baseApi methods
vi.mock('../../service/baseApi', () => ({
    default: {
        get: vi.fn(),
        delete: vi.fn(),
        put: vi.fn(),
        post: vi.fn(),
    },
}));

describe('DishRecordService', () => {
    // Reset mocks before each test
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getAllDishRecords', () => {
        test('should make GET request with pagination parameters', async () => {
            const mockResponse = { data: [] };
            baseApi.get.mockResolvedValue(mockResponse);

            const result = await DishRecordService.getAllDishRecords(1, 10);

            expect(baseApi.get).toHaveBeenCalledWith('/dishrecords?page=1&size=10');
            expect(result).toEqual(mockResponse);
        });
    });

    describe('deleteDishRecords', () => {
        test('should make DELETE request with array of IDs in body', async () => {
            const mockIds = [1, 2, 3];
            const mockResponse = { data: { success: true } };
            baseApi.delete.mockResolvedValue(mockResponse);

            const result = await DishRecordService.deleteDishRecords(mockIds);

            expect(baseApi.delete).toHaveBeenCalledWith('/dishrecords', {
                data: mockIds
            });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('updateDishRecord', () => {
        test('should make PUT request with ID and DTO payload', async () => {
            const mockId = 123;
            const mockDto = { name: 'Updated Dish' };
            const mockResponse = { data: mockDto };
            baseApi.put.mockResolvedValue(mockResponse);

            const result = await DishRecordService.updateDishRecord(mockId, mockDto);

            expect(baseApi.put).toHaveBeenCalledWith(
                '/dishrecords/123',
                mockDto
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('addDishRecord', () => {
        test('should make POST request with DTO payload', async () => {
            const mockDto = { name: 'New Dish' };
            const mockResponse = { data: mockDto };
            baseApi.post.mockResolvedValue(mockResponse);

            const result = await DishRecordService.addDishRecord(mockDto);

            expect(baseApi.post).toHaveBeenCalledWith(
                '/dishrecords',
                mockDto
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('searchDishRecords', () => {
        test('should call getAllDishRecords when search string is empty', async () => {
            const mockResponse = { data: [] };
            baseApi.get.mockResolvedValue(mockResponse);

            await DishRecordService.searchDishRecords('', 1, 10);

            expect(baseApi.get).toHaveBeenCalledWith('/dishrecords?page=1&size=10');
        });

        test('should make search GET request with parameters when search string exists', async () => {
            const mockResponse = { data: [] };
            baseApi.get.mockResolvedValue(mockResponse);

            await DishRecordService.searchDishRecords('pizza', 2, 15);

            expect(baseApi.get).toHaveBeenCalledWith(
                '/dishrecords/search?searchString=pizza&page=2&size=15'
            );
        });
    });

    describe('getDishRecordAnalysis', () => {
        test('should make GET request with start and end time', async () => {
            const mockResponse = { data: [] };
            baseApi.get.mockResolvedValue(mockResponse);

            const startTime = '2023-01-01T00:00:00.000Z';
            const endTime = '2023-02-01T00:00:00.000Z';

            await DishRecordService.getDishRecordAnalysis(startTime, endTime);

            expect(baseApi.get).toHaveBeenCalledWith(
                `/dishrecords/analysis?startTime=${startTime}&endTime=${endTime}`
            );
        })
    });
});
