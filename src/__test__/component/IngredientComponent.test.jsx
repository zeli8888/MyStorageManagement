import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react';
import { describe, test, vi, beforeEach, expect } from 'vitest';
import IngredientComponent from '../../component/IngredientComponent';
import { FoodContext } from '../../component/FoodProvider';
import ingredientService from '../../service/IngredientService';
import '@testing-library/jest-dom/vitest';

// Mock navigation hook
vi.mock('react-router-dom', () => ({
    useNavigate: () => vi.fn(),
}));

// Mock service layer
vi.mock('../../service/IngredientService', () => ({
    default: {
        getAllIngredients: vi.fn().mockResolvedValue({ data: [] }),
        searchIngredients: vi.fn().mockResolvedValue({ data: [] }),
        addIngredient: vi.fn().mockResolvedValue({}),
        updateIngredient: vi.fn().mockResolvedValue({}),
        deleteIngredients: vi.fn().mockResolvedValue({}),
    },
}));

// Mock complex child components
vi.mock('../../component/utils', () => ({
    EnhancedTableToolbar: ({ tableTitle, onSearch, deleteSelected, updateSelected }) => (
        <div>
            {tableTitle}
            <input
                data-testid="search-input"
                onChange={(e) => onSearch(e.target.value)}
            />
            <button data-testid="delete-button" onClick={deleteSelected}>Delete</button>
            <button data-testid="update-button" onClick={updateSelected}>Update</button>
        </div>
    ),
    DeletionConfirmationComponent: ({ onConfirm, onClose }) => (
        <div>
            <button data-testid="confirm-delete" onClick={onConfirm}>Confirm</button>
            <button data-testid="cancel-delete" onClick={onClose}>Cancel</button>
        </div>
    ),
}));

// Mock DataGrid with selection handling
vi.mock('@mui/x-data-grid', () => ({
    DataGrid: ({ rows, onRowSelectionModelChange }) => (
        <div data-testid="datagrid">
            {rows.map(row => (
                <div key={row.ingredientId}>{row.ingredientName}</div>
            ))}
            <button
                data-testid="select-row"
                onClick={() => onRowSelectionModelChange({ ids: [1] })}
            >
                Select Row
            </button>
        </div>
    ),
}));

describe('IngredientComponent Integration Tests', () => {
    const mockIngredient = {
        ingredientId: 1,
        ingredientName: 'Test Ingredient',
        ingredientStorage: 5,
        ingredientCost: 10,
        ingredientDesc: 'Test Description'
    };

    beforeEach(() => {
        vi.clearAllMocks();
        ingredientService.getAllIngredients.mockResolvedValue({ data: [mockIngredient] });
    });
    afterEach(cleanup);

    // Base snapshot verification
    test('initial render matches snapshot', async () => {
        const { asFragment } = render(
            <FoodContext.Provider value={{ setAllIngredients: vi.fn() }}>
                <IngredientComponent />
            </FoodContext.Provider>
        );

        await waitFor(() => expect(screen.getByText('Test Ingredient')).toBeInTheDocument());
        expect(asFragment()).toMatchSnapshot();
    });

    // Search functionality
    test('search triggers API call', async () => {
        render(
            <FoodContext.Provider value={{ setAllIngredients: vi.fn() }}>
                <IngredientComponent />
            </FoodContext.Provider>
        );

        await waitFor(() => screen.getByTestId('search-input'));
        fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'test' } });

        await waitFor(() => {
            expect(ingredientService.searchIngredients).toHaveBeenCalledWith('test');
        });
    });

    // Add functionality
    test('new ingredient submission', async () => {
        render(
            <FoodContext.Provider value={{ setAllIngredients: vi.fn() }}>
                <IngredientComponent />
            </FoodContext.Provider>
        );

        fireEvent.click(screen.getByText(/New Ingredient/i));
        fireEvent.change(screen.getByLabelText(/Ingredient Name/i), { target: { value: 'NewItem' } });
        fireEvent.change(screen.getByLabelText(/Ingredient Storage/i), { target: { value: '5' } });
        fireEvent.click(screen.getByText(/Save/i));

        await waitFor(() => {
            expect(ingredientService.addIngredient).toHaveBeenCalledWith({
                ingredientName: 'NewItem',
                ingredientStorage: '5',
                ingredientCost: '',
                ingredientDesc: ''
            });
        });
    });

    // Update functionality
    test('existing ingredient update', async () => {
        render(
            <FoodContext.Provider value={{ setAllIngredients: vi.fn() }}>
                <IngredientComponent />
            </FoodContext.Provider>
        );

        await waitFor(() => screen.getByTestId(/select-row/i));
        fireEvent.click(screen.getByTestId(/select-row/i));
        fireEvent.click(screen.getByTestId(/update-button/i));
        fireEvent.change(screen.getByLabelText(/Ingredient Name/i), { target: { value: 'Updated' } });
        fireEvent.click(screen.getByText(/Save/i));

        await waitFor(() => {
            expect(ingredientService.updateIngredient).toHaveBeenCalledWith('1', {
                ingredientId: '1',
                ingredientName: 'Updated',
                ingredientStorage: '5',
                ingredientCost: '10',
                ingredientDesc: 'Test Description'
            });
        });
    });

    // Delete functionality
    test('ingredient deletion flow', async () => {
        render(
            <FoodContext.Provider value={{ setAllIngredients: vi.fn() }}>
                <IngredientComponent />
            </FoodContext.Provider>
        );

        await waitFor(() => screen.getByTestId('select-row'));
        fireEvent.click(screen.getByTestId('select-row'));
        fireEvent.click(screen.getByTestId('delete-button'));
        fireEvent.click(screen.getByTestId('confirm-delete'));

        await waitFor(() => {
            expect(ingredientService.deleteIngredients).toHaveBeenCalledWith([1]);
        });
    });

    // Error state test
    test('error alert', async () => {
        const consoleErrorMock = vi.spyOn(console, 'log').mockImplementation(() => { });
        ingredientService.getAllIngredients.mockRejectedValue(new Error('test Error'));

        let mockSetAllIngredients = vi.fn();
        render(
            <FoodContext.Provider value={{ setAllIngredients: mockSetAllIngredients }}>
                <IngredientComponent />
            </FoodContext.Provider>
        );

        await waitFor(() => {
            expect(mockSetAllIngredients).not.toHaveBeenCalled();
        });
        expect(consoleErrorMock).toHaveBeenCalledWith(new Error('test Error'));
        consoleErrorMock.mockRestore();
    });
});
