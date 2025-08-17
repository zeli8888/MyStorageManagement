import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react';
import { describe, test, vi, beforeEach, expect } from 'vitest';
import DishRecordComponent from '../../component/DishRecordComponent';
import { FoodContext } from '../../component/FoodProvider';
import dishRecordService from '../../service/DishRecordService';
import '@testing-library/jest-dom/vitest';

// Mock navigation hook
vi.mock('react-router-dom', () => ({
    useNavigate: () => vi.fn(),
}));

// Mock service layer
vi.mock('../../service/DishRecordService', () => ({
    default: {
        searchDishRecords: vi.fn().mockResolvedValue({
            data: {
                content: [],
                totalElements: 0
            }
        }),
        updateDishRecord: vi.fn().mockResolvedValue({}),
        deleteDishRecords: vi.fn().mockResolvedValue({}),
    },
}));

// Mock complex child components
vi.mock('../../component/utils', async (importOriginal) => ({
    ...await importOriginal(),
    EnhancedTableToolbar: ({ tableTitle, onSearch, deleteSelected, updateSelected }) => (
        <div>
            {tableTitle}
            <input data-testid="search-input" onChange={(e) => onSearch(e.target.value)} />
            <button data-testid="delete-button" onClick={deleteSelected}>Delete</button>
            <button data-testid="update-button" onClick={updateSelected}>Update</button>
        </div>
    ),
    DeletionConfirmationComponent: ({ open, onClose, onConfirm, warningMessage }) => (
        <div>
            {open && (
                <div>
                    <p>{warningMessage}</p>
                    <button onClick={onConfirm}>Confirm</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            )}
        </div>
    ),
    EnhancedTableHead: () => <thead data-testid="enhanced-table-head" />,
}));

describe('DishRecord Component Integration Tests', () => {
    const mockDishRecords = [
        {
            dishRecordId: 1,
            dishRecordTime: '2023-01-01T12:00:00',
            dishRecordDesc: 'Test Record',
            dish: {
                dishId: 1,
                dishName: 'Test Dish'
            },
            dishRecordIngredients: [
                {
                    dishRecordIngredientQuantity: 2,
                    ingredient: {
                        ingredientId: 1,
                        ingredientName: 'Test Ingredient',
                        ingredientStorage: 5,
                        ingredientCost: 10,
                        ingredientDesc: 'Test Ingredient Desc',
                    }
                }
            ]
        }
    ];

    const mockContextValue = {
        allIngredients: [
            {
                ingredientId: 1,
                ingredientName: 'Test Ingredient',
                ingredientStorage: 5,
                ingredientCost: 10,
                ingredientDesc: 'Test Ingredient Desc',
            }
        ],
        allDishes: [
            {
                dishId: 1,
                dishName: 'Test Dish',
                dishDesc: 'Test Dish Desc'
            }
        ]
    };

    beforeEach(() => {
        vi.clearAllMocks();
        dishRecordService.searchDishRecords.mockResolvedValue({
            data: {
                content: mockDishRecords,
                totalElements: 1
            }
        });
    });
    afterEach(cleanup);

    // Base snapshot verification
    test('initial render matches snapshot', async () => {
        const { asFragment } = render(
            <FoodContext.Provider value={mockContextValue}>
                <DishRecordComponent />
            </FoodContext.Provider>
        );
        await waitFor(() => expect(screen.getByText('Test Record')).toBeInTheDocument());
        expect(asFragment()).toMatchSnapshot();
    });

    // Search functionality
    test('search triggers API call', async () => {
        render(
            <FoodContext.Provider value={mockContextValue}>
                <DishRecordComponent />
            </FoodContext.Provider>
        );
        await waitFor(() => screen.getByTestId('search-input'));
        fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'test' } });
        await waitFor(() => {
            expect(dishRecordService.searchDishRecords).toHaveBeenCalledWith('test', 0, 10);
        });
    });

    // Update functionality
    test('existing record update', async () => {
        render(
            <FoodContext.Provider value={mockContextValue}>
                <DishRecordComponent />
            </FoodContext.Provider>
        );
        await waitFor(() => screen.getByText('Test Record'));
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[1]); // Select first record
        fireEvent.click(screen.getByTestId('update-button'));

        fireEvent.change(screen.getByLabelText(/Record Description/i), {
            target: { value: 'Updated Description' }
        });
        fireEvent.click(screen.getByText('Save'));

        await waitFor(() => {
            expect(dishRecordService.updateDishRecord).toHaveBeenCalledWith(
                1,
                expect.objectContaining({
                    dishRecord: expect.objectContaining({
                        dishRecordDesc: "Updated Description"
                    })
                })
            );
        });
    });

    // Delete functionality
    test('deletes selected records', async () => {
        render(
            <FoodContext.Provider value={mockContextValue}>
                <DishRecordComponent />
            </FoodContext.Provider>
        );
        await waitFor(() => screen.getByText('Test Record'));
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[1]); // Select first record
        fireEvent.click(screen.getByTestId('delete-button'));
        fireEvent.click(screen.getByText(/confirm/i));

        await waitFor(() => {
            expect(dishRecordService.deleteDishRecords).toHaveBeenCalledWith([1]);
        });
    });

    // Error state handling
    test('error logging', async () => {
        const consoleErrorMock = vi.spyOn(console, 'log').mockImplementation(() => { });
        dishRecordService.searchDishRecords.mockRejectedValue(new Error('API Error'));

        render(
            <FoodContext.Provider value={mockContextValue}>
                <DishRecordComponent />
            </FoodContext.Provider>
        );

        await waitFor(() => {
            expect(consoleErrorMock).toHaveBeenCalledWith(new Error('API Error'));
        });
        consoleErrorMock.mockRestore();
    });

    // Expandable content verification
    test('displays ingredients when expanded', async () => {
        const { asFragment } = render(
            <FoodContext.Provider value={mockContextValue}>
                <DishRecordComponent />
            </FoodContext.Provider>
        );
        await waitFor(() => screen.getByText('Test Record'));
        fireEvent.click(screen.getByRole('button', { name: /expand row/i }));

        await waitFor(() => {
            expect(screen.getByText('Test Dish')).toBeInTheDocument();
            expect(asFragment()).toMatchSnapshot();
        });
    });
});
