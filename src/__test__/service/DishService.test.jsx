import { describe, test, expect, vi, beforeEach } from 'vitest';
import baseApi from '../../service/baseApi';
import DishService from '../../service/DishService';

// Mock baseApi methods
vi.mock('../../service/baseApi', () => ({
    default: {
        get: vi.fn(),
        delete: vi.fn(),
        put: vi.fn(),
        post: vi.fn(),
    },
}));

describe('DishService', () => {
    // Reset mocks before each test
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getAllDishes', () => {
        test('should fetch all dishes with GET request', async () => {
            const mockResponse = { data: [] };
            baseApi.get.mockResolvedValue(mockResponse);

            const result = await DishService.getAllDishes();

            expect(baseApi.get).toHaveBeenCalledWith('/dishes');
            expect(result).toEqual(mockResponse);
        });
    });

    describe('deleteDishes', () => {
        test('should delete dishes with DELETE request containing IDs array', async () => {
            const mockIds = [1, 2, 3];
            const mockResponse = { data: { success: true } };
            baseApi.delete.mockResolvedValue(mockResponse);

            const result = await DishService.deleteDishes(mockIds);

            expect(baseApi.delete).toHaveBeenCalledWith('/dishes', {
                data: mockIds
            });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('updateDish', () => {
        test('should send PUT request with correct ID and payload', async () => {
            const mockId = 456;
            const mockDto = { name: 'Updated Dish' };
            const mockResponse = { data: mockDto };
            baseApi.put.mockResolvedValue(mockResponse);

            const result = await DishService.updateDish(mockId, mockDto);

            expect(baseApi.put).toHaveBeenCalledWith(
                '/dishes/456',
                mockDto
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('addDish', () => {
        test('should create new dish with POST request', async () => {
            const mockDto = { name: 'New Dish' };
            const mockResponse = { data: mockDto };
            baseApi.post.mockResolvedValue(mockResponse);

            const result = await DishService.addDish(mockDto);

            expect(baseApi.post).toHaveBeenCalledWith(
                '/dishes',
                mockDto
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('searchDishes', () => {
        test('should fallback to getAllDishes when search string is empty', async () => {
            const mockResponse = { data: [] };
            baseApi.get.mockResolvedValue(mockResponse);

            await DishService.searchDishes('');

            expect(baseApi.get).toHaveBeenCalledWith('/dishes');
        });

        test('should use search endpoint with query parameter', async () => {
            const mockResponse = { data: [] };
            baseApi.get.mockResolvedValue(mockResponse);

            await DishService.searchDishes('pasta');

            expect(baseApi.get).toHaveBeenCalledWith(
                '/dishes/search?searchString=pasta'
            );
        });
    });
});
