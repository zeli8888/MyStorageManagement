import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react';
import { describe, test, vi, beforeEach, expect } from 'vitest';
import DishComponent from '../../component/DishComponent';
import { FoodContext } from '../../component/FoodProvider';
import dishService from '../../service/DishService';
import dishRecordService from '../../service/DishRecordService';
import '@testing-library/jest-dom/vitest';

// Mock navigation hook
vi.mock('react-router-dom', () => ({
    useNavigate: () => vi.fn(),
}));

// Mock service layer
vi.mock('../../service/DishService', () => ({
    default: {
        getAllDishes: vi.fn().mockResolvedValue({ data: [] }),
        searchDishes: vi.fn().mockResolvedValue({ data: [] }),
        addDish: vi.fn().mockResolvedValue({}),
        updateDish: vi.fn().mockResolvedValue({}),
        deleteDishes: vi.fn().mockResolvedValue({}),
    },
}));

vi.mock('../../service/DishRecordService', () => ({
    default: {
        addDishRecord: vi.fn().mockResolvedValue({}),
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
        </div>),
    EnhancedTableHead: () => <thead data-testid="enhanced-table-head" />,

}));

describe('Dish Component Integration Tests', () => {
    const mockDishes = [
        {
            dishId: 1,
            dishName: 'Test Dish',
            dishDesc: 'Test Description',
            dishIngredients: [
                {
                    dishIngredientQuantity: 2,
                    ingredient: {
                        ingredientId: 1,
                        ingredientName: 'Test Ingredient',
                        ingredientStorage: 5,
                        ingredientCost: 10,
                        ingredientDesc: 'Test Ingredient Description',
                    },
                },
            ],
        },
    ];

    const mockContextValue = {
        allIngredients: [
            {
                ingredientId: 1,
                ingredientName: 'Test Ingredient',
                ingredientStorage: 5,
                ingredientCost: 10,
                ingredientDesc: 'Test Ingredient Description',
            },
        ],
        setAllDishes: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        dishService.getAllDishes.mockResolvedValue({ data: mockDishes });
        dishService.searchDishes.mockResolvedValue({ data: mockDishes });
        dishService.addDish.mockResolvedValue({});
        dishService.updateDish.mockResolvedValue({});
        dishService.deleteDishes.mockResolvedValue({});
    });

    afterEach(cleanup);

    // Base snapshot verification
    test('initial render matches snapshot', async () => {
        const { asFragment } = render(
            <FoodContext.Provider value={mockContextValue}>
                <DishComponent />
            </FoodContext.Provider>
        );

        await waitFor(() => expect(screen.getByText('Test Dish')).toBeInTheDocument());
        expect(asFragment()).toMatchSnapshot();
    });

    // Search functionality
    test('search triggers API call', async () => {
        render(
            <FoodContext.Provider value={mockContextValue}>
                <DishComponent />
            </FoodContext.Provider>
        );

        await waitFor(() => screen.getByTestId('search-input'));
        fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'test' } });

        await waitFor(() => {
            expect(dishService.searchDishes).toHaveBeenCalledWith('test');
        });
    });

    // Add functionality
    test('adds new dish with ingredients', async () => {
        render(
            <FoodContext.Provider value={mockContextValue}>
                <DishComponent />
            </FoodContext.Provider>
        );

        fireEvent.click(screen.getByText(/New Dish/i));
        fireEvent.change(screen.getByLabelText(/Dish Name/i), { target: { value: 'New Dish' } });
        const select = screen.getByRole('combobox', { name: /Recipe/i });
        fireEvent.click(select);
        fireEvent.click(screen.getByText(/Save/i));

        await waitFor(() => {
            expect(dishService.addDish).toHaveBeenCalled();
        });
    });

    // Update functionality
    test('existing dish update', async () => {
        render(
            <FoodContext.Provider value={mockContextValue}>
                <DishComponent />
            </FoodContext.Provider>
        );
        const checkboxes = await waitFor(() => screen.getAllByRole('checkbox'));
        fireEvent.click(checkboxes[1]); // Select first dish
        fireEvent.click(screen.getByTestId(/update-button/i));
        fireEvent.change(screen.getByLabelText(/Dish Name/i), { target: { value: 'Updated' } });
        fireEvent.click(screen.getByText(/Save/i));

        await waitFor(() => {
            expect(dishService.updateDish).toHaveBeenCalledWith(
                1,
                expect.objectContaining({
                    dish: expect.objectContaining({
                        dishName: "Updated"
                    })
                })
            )
        });
    });


    // Delete functionality
    test('deletes selected dishes', async () => {
        render(
            <FoodContext.Provider value={mockContextValue}>
                <DishComponent />
            </FoodContext.Provider>
        );

        await waitFor(() => screen.getByText('Test Dish'));
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[1]); // Select first dish
        fireEvent.click(screen.getByTestId('delete-button'));
        fireEvent.click(screen.getByText(/confirm/i));

        await waitFor(() => {
            expect(dishService.deleteDishes).toHaveBeenCalled();
        });
    });

    // Record addition
    test('adds dish record', async () => {
        render(
            <FoodContext.Provider value={mockContextValue}>
                <DishComponent />
            </FoodContext.Provider>
        );

        await waitFor(() => screen.getByText('Test Dish'));
        fireEvent.click(screen.getByRole('button', { name: /add/i }));
        fireEvent.click(screen.getByText('Save'));

        await waitFor(() => {
            expect(dishRecordService.addDishRecord).toHaveBeenCalled();
        });
    });

    // Error state snapshot
    test('error alert', async () => {
        const consoleErrorMock = vi.spyOn(console, 'log').mockImplementation(() => { });
        dishService.getAllDishes.mockRejectedValue(new Error('test Error'));
        let mockSetAllDishes = vi.fn();

        render(
            <FoodContext.Provider value={{ setAllDishes: mockSetAllDishes, allIngredients: [] }}>
                <DishComponent />
            </FoodContext.Provider>
        );

        await waitFor(() => {
            expect(mockSetAllDishes).not.toHaveBeenCalled();
        });
        expect(consoleErrorMock).toHaveBeenCalledWith(new Error('test Error'));
        consoleErrorMock.mockRestore();
    });

    // Expandable content
    test('displays recipe details when expanded', async () => {
        render(
            <FoodContext.Provider value={mockContextValue}>
                <DishComponent />
            </FoodContext.Provider>
        );

        await waitFor(() => screen.getByText('Test Dish'));
        fireEvent.click(screen.getByRole('button', { name: /expand row/i }));

        await waitFor(() => {
            expect(screen.getByText('Test Ingredient')).toBeInTheDocument();
        });
    });
});