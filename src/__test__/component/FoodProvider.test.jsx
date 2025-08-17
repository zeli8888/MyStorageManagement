import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import FoodProvider, { FoodContext } from '../../component/FoodProvider';
import ingredientService from '../../service/IngredientService'
import dishService from '../../service/DishService'
import { act } from 'react';
import '@testing-library/jest-dom/vitest'

// Mock external services
vi.mock('../../service/IngredientService', () => ({
    default: {
        getAllIngredients: vi.fn(),
    },
}));

vi.mock('../../service/DishService', () => ({
    default: {
        getAllDishes: vi.fn(),
    },
}));

// Mock data for API responses
const mockIngredients = [{ id: 1, name: 'Tomato' }];
const mockDishes = [{ id: 1, name: 'Salad' }];

describe('FoodProvider', () => {
    beforeEach(() => {
        // Reset all mocks before each test
        vi.clearAllMocks();

        // Setup mock implementations
        ingredientService.getAllIngredients.mockResolvedValue({ data: mockIngredients });
        dishService.getAllDishes.mockResolvedValue({ data: mockDishes });
    });
    afterEach(cleanup)

    test('matches snapshot', async () => {
        // Arrange
        let container;
        await act(async () => {
            ({ container } = render(
                <FoodProvider>
                    <div>Test Child</div>
                </FoodProvider>
            ));
        });

        // Assert
        expect(container).toMatchSnapshot();
    });

    test('provides context values to children', async () => {
        // Arrange
        const TestComponent = () => {
            return (
                <FoodContext.Consumer>
                    {(value) => (
                        <div>
                            <span data-testid="ingredients-count">{value.allIngredients.length}</span>
                            <span data-testid="dishes-count">{value.allDishes.length}</span>
                        </div>
                    )}
                </FoodContext.Consumer>
            );
        };

        // Act
        await act(async () => {
            render(
                <FoodProvider>
                    <TestComponent />
                </FoodProvider>
            );
        });

        // Assert
        expect(await screen.findByTestId('ingredients-count')).toHaveTextContent('1');
        expect(await screen.findByTestId('dishes-count')).toHaveTextContent('1');
    });

    test('fetches initial data on mount', async () => {
        // Arrange
        await act(async () => {
            render(
                <FoodProvider>
                    <div>Test Child</div>
                </FoodProvider>
            );
        });

        // Assert
        expect(ingredientService.getAllIngredients).toHaveBeenCalledTimes(1);
        expect(dishService.getAllDishes).toHaveBeenCalledTimes(1);
    });
});
