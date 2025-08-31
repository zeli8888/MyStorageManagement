// HomeComponent.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, vi, beforeEach, afterEach } from 'vitest';
import HomeComponent from '../../component/HomeComponent';
import { useNavigate } from 'react-router-dom';
import dishRecordService from '../../service/DishRecordService';

// Mock dependencies
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

vi.mock('../../service/DishRecordService', () => ({
    default: {
        getDishRecordAnalysis: vi.fn(),
    },
}));

vi.mock('dayjs', async (importOriginal) => {
    const originalModule = await importOriginal();
    return {
        default: (config) => {
            if (!config) return originalModule.default('2024-01-01');
            return originalModule.default(config);
        },
    };
});

describe('HomeComponent', () => {
    const mockNavigate = vi.fn();
    const mockAnalysisData = {
        ingredientsSummary: [
            {
                ingredient: {
                    ingredientId: 1,
                    ingredientName: 'Test Ingredient',
                    ingredientCost: 10,
                    ingredientStorage: 100,
                    ingredientDesc: 'Test Description',
                },
                supplyDays: 5,
                dailyUsage: 2,
                totalUsage: 10,
                totalCost: 100,
            },
        ],
        dishesSummary: [
            {
                dish: {
                    dishId: 1,
                    dishName: 'Test Dish',
                },
                totalUsage: 5,
            },
        ],
    };

    beforeEach(() => {
        useNavigate.mockImplementation(() => mockNavigate);
        dishRecordService.getDishRecordAnalysis.mockResolvedValue({
            data: mockAnalysisData,
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should match snapshot', async () => {
        const { container } = render(<HomeComponent />);
        await screen.findByText('Analysis Period');
        expect(container).toMatchSnapshot();
    });

    it('should apply last month filter when Last Month button is clicked', async () => {
        render(<HomeComponent />);
        await screen.findByText('Analysis Period');

        fireEvent.click(screen.getByRole('button', { name: /last month/i }));

        expect(dishRecordService.getDishRecordAnalysis).toHaveBeenCalledWith(
            '2023-12-01T00:00:00.000Z',
            '2024-01-01T00:00:00.000Z'
        );
    });

    it('should apply last week filter when Last Week button is clicked', async () => {
        render(<HomeComponent />);
        await screen.findByText('Analysis Period');

        fireEvent.click(screen.getByRole('button', { name: /last week/i }));

        expect(dishRecordService.getDishRecordAnalysis).toHaveBeenCalledWith(
            '2023-12-25T00:00:00.000Z',
            '2024-01-01T00:00:00.000Z'
        );
    });

    it('should apply 3 days filter when 3 Days button is clicked', async () => {
        render(<HomeComponent />);
        await screen.findByText('Analysis Period');

        fireEvent.click(screen.getByRole('button', { name: /3 days/i }));

        expect(dishRecordService.getDishRecordAnalysis).toHaveBeenCalledWith(
            '2023-12-29T00:00:00.000Z',
            '2024-01-01T00:00:00.000Z'
        );
    });

    it('should apply custom date filter using date pickers', async () => {
        const user = userEvent.setup();
        const { rerender } = render(<HomeComponent />);

        await screen.findByText('Analysis Period');

        const startInput = screen.getByTestId('start-date-picker').querySelector('input');
        const endInput = screen.getByTestId('end-date-picker').querySelector('input');

        await user.click(startInput);
        await user.clear(startInput);
        await user.type(startInput, '01/15/2024');
        await user.tab();

        await user.click(endInput);
        await user.clear(endInput);
        await user.type(endInput, '01/20/2024');
        await user.tab();

        await waitFor(() => {
            expect(startInput.value).toBe('01/15/2024');
            expect(endInput.value).toBe('01/20/2024');
        });

        fireEvent.click(screen.getByRole('button', { name: /apply filter/i }));

        expect(dishRecordService.getDishRecordAnalysis).toHaveBeenLastCalledWith(
            '2024-01-15T00:00:00.000Z',
            '2024-01-20T00:00:00.000Z'
        );
    });

});
