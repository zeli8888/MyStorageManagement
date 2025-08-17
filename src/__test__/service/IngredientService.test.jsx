import { describe, test, expect, vi, beforeEach } from 'vitest';
import baseApi from '../../service/baseApi';
import IngredientService from '../../service/IngredientService';

// Mock baseApi methods
vi.mock('../../service/baseApi', () => ({
    default: {
        get: vi.fn(),
        delete: vi.fn(),
        put: vi.fn(),
        post: vi.fn(),
    },
}));

describe('IngredientService', () => {
    // Reset mock states between tests
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getAllIngredients', () => {
        test('should fetch all ingredients via GET request', async () => {
            const mockData = [{ id: 1, name: 'Flour' }];
            baseApi.get.mockResolvedValue({ data: mockData });

            const result = await IngredientService.getAllIngredients();

            expect(baseApi.get).toHaveBeenCalledWith('/ingredients');
            expect(result.data).toEqual(mockData);
        });
    });

    describe('deleteIngredients', () => {
        test('should delete ingredients with DELETE request containing ID array', async () => {
            const mockIds = [10, 20, 30];
            baseApi.delete.mockResolvedValue({ status: 204 });

            await IngredientService.deleteIngredients(mockIds);

            expect(baseApi.delete).toHaveBeenCalledWith('/ingredients', {
                data: mockIds
            });
        });
    });

    describe('updateIngredient', () => {
        test('should send PUT request with correct ID and payload', async () => {
            const mockId = 15;
            const mockIngredient = { name: 'Updated Sugar' };
            baseApi.put.mockResolvedValue({ data: mockIngredient });

            const result = await IngredientService.updateIngredient(mockId, mockIngredient);

            expect(baseApi.put).toHaveBeenCalledWith(
                '/ingredients/15',
                mockIngredient
            );
            expect(result.data).toEqual(mockIngredient);
        });
    });

    describe('addIngredient', () => {
        test('should create new ingredient via POST request', async () => {
            const newIngredient = { name: 'Vanilla Extract' };
            const mockResponse = { data: { id: 99, ...newIngredient } };
            baseApi.post.mockResolvedValue(mockResponse);

            const result = await IngredientService.addIngredient(newIngredient);

            expect(baseApi.post).toHaveBeenCalledWith(
                '/ingredients',
                newIngredient
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('searchIngredients', () => {
        test('should return all ingredients when search string is empty', async () => {
            baseApi.get.mockResolvedValue({ data: [] });

            await IngredientService.searchIngredients('');
            expect(baseApi.get).toHaveBeenCalledWith('/ingredients');
        });

        test('should use search endpoint with encoded query parameter', async () => {
            const searchQuery = 'organic milk';

            await IngredientService.searchIngredients(searchQuery);
            expect(baseApi.get).toHaveBeenCalledWith(
                `/ingredients/search?searchString=${searchQuery}`
            );
        });
    });
});
