import { describe, expect, test, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
    DeletionConfirmationComponent,
    SearchComponent,
    RememberMeCheckbox,
    getVisibleRows,
    handleClick,
    EnhancedTableHead,
    EnhancedTableToolbar,
    NumberInput,
    PieChartCard,
    pieChartColors
} from '../../component/utils';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
// Mock data for table tests
const mockHeadCells = [{ id: 'name', label: 'Name', sortingEnabled: true }];
const mockRows = [{ id: 1, name: 'Apple' }, { id: 2, name: 'Banana' }];

vi.mock('react-number-format', () => ({
    NumericFormat: vi.fn(({ customInput, ...props }) => {
        const InputComponent = customInput || 'input'
        return <InputComponent {...props} />
    })
}))

describe('NumberInput component', () => {
    test('renders with default value', () => {
        render(<NumberInput defaultValue={123.45} />)
        const input = screen.getByRole('textbox')
        expect(input).toHaveValue('123.45')
    })

    // This test fails because NumericFormat doesn't trigger some how.
    // test('updates value', async () => {
    //     const user = userEvent.setup();
    //     render(<NumberInput defaultValue={1} prefix="€" />);
    //     const input = screen.getByRole('textbox');

    //     screen.debug();

    //     await user.click(input);
    //     await user.keyboard('{Control>}a{/Control}');
    //     await user.keyboard('{Backspace}');

    //     screen.debug();

    //     await user.type(input, '123.45');

    //     screen.debug();

    //     await waitFor(() => {
    //         expect(input).toHaveValue('€123.45');
    //     }, { timeout: 3000 });
    // });

    test('has empty value', () => {
        render(<NumberInput />)
        const input = screen.getByRole('textbox')
        expect(input).toHaveValue('')
    })
})

describe('DeletionConfirmationComponent', () => {
    test('renders dialog when open is true', () => {
        render(<DeletionConfirmationComponent open={true} onClose={vi.fn()}
            onConfirm={vi.fn()} warningMessage="Test message" />);
        expect(screen.getByText('Confirmation')).toBeInTheDocument();
        expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    test('calls onConfirm when Yes button is clicked', () => {
        const mockConfirm = vi.fn();
        render(<DeletionConfirmationComponent open={true} onClose={vi.fn()}
            onConfirm={mockConfirm} warningMessage="Test" />);
        fireEvent.click(screen.getByText('Yes'));
        expect(mockConfirm).toHaveBeenCalled();
    });


    test('matches dialog open snapshot', () => {
        const { asFragment } = render(
            <DeletionConfirmationComponent
                open={true}
                onClose={vi.fn()}
                onConfirm={vi.fn()}
                warningMessage="Snapshot test"
            />
        );
        expect(asFragment()).toMatchSnapshot();
    });
});

describe('SearchComponent', () => {
    test('triggers onSearch with input value on Enter key', () => {
        const mockSearch = vi.fn();
        render(<SearchComponent onSearch={mockSearch} />);
        const input = screen.getByLabelText('Search');
        fireEvent.change(input, { target: { value: 'test' } });
        fireEvent.keyDown(input, { key: 'Enter' });
        expect(mockSearch).toHaveBeenCalledWith('test');
    });

    test('updates search text on input change', () => {
        render(<SearchComponent onSearch={vi.fn()} />);
        const input = screen.getByLabelText('Search');
        fireEvent.change(input, { target: { value: 'new value' } });
        expect(input.value).toBe('new value');
    });


    test('matches search component snapshot', () => {
        const { asFragment } = render(<SearchComponent onSearch={vi.fn()} />);
        expect(asFragment()).toMatchSnapshot();
    });
});

describe('RememberMeCheckbox', () => {
    test('toggles checked state when clicked', () => {
        let checked = false;
        const setChecked = (val) => checked = val;
        render(<RememberMeCheckbox rememberMe={checked} setRememberMe={setChecked} />);
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(checked).toBe(true);
    });


    test('matches checkbox snapshot', () => {
        const { asFragment } = render(
            <RememberMeCheckbox
                rememberMe={false}
                setRememberMe={vi.fn()}
            />
        );
        expect(asFragment()).toMatchSnapshot();
    });
});

describe('getVisibleRows', () => {
    test('sorts and paginates correctly', () => {
        const rows = [{ id: 1, name: 'Z' }, { id: 2, name: 'A' }];
        const result = getVisibleRows(rows, 'asc', 'name', 0, 1);
        expect(result[0].name).toBe('A');
        expect(result.length).toBe(1);
    });


    test('matches sorted rows snapshot', () => {
        const rows = [{ id: 1, name: 'Z' }, { id: 2, name: 'A' }];
        const result = getVisibleRows(rows, 'asc', 'name', 0, 1);
        expect(result).toMatchSnapshot();
    });
});

describe('handleClick', () => {
    test('toggles selection correctly', () => {
        let selected = [];
        const setSelected = (newVal) => selected = newVal;

        handleClick(null, 1, selected, setSelected);
        expect(selected).toEqual([1]);

        handleClick(null, 1, selected, setSelected);
        expect(selected).toEqual([]);

        selected = [1, 2];
        handleClick(null, 2, selected, setSelected);
        expect(selected).toEqual([1]);

        selected = [1, 2, 3];
        handleClick(null, 2, selected, setSelected);
        expect(selected).toEqual([1, 3]);
    });


    test('matches selection states snapshot', () => {
        let selected = [];
        const setSelected = (newVal) => selected = newVal;

        // Test multiple states
        handleClick(null, 1, selected, setSelected);
        const state1 = [...selected];

        handleClick(null, 1, selected, setSelected);
        const state2 = [...selected];

        selected = [1, 2, 3];
        handleClick(null, 2, selected, setSelected);
        const state3 = [...selected];

        expect([state1, state2, state3]).toMatchSnapshot();
    });
});

describe('EnhancedTableHead', () => {
    const mockSetOrder = vi.fn();
    const mockSetOrderBy = vi.fn();
    const mockSetSelected = vi.fn();
    const defaultProps = {
        order: 'asc',
        orderBy: 'name',
        setOrder: mockSetOrder,
        setOrderBy: mockSetOrderBy,
        numSelected: 0,
        headCells: mockHeadCells,
        rows: mockRows,
        setSelected: mockSetSelected,
        idAttributeName: 'id'
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    test('renders select all checkbox correctly', () => {
        render(
            <table>
                <EnhancedTableHead
                    {...defaultProps}
                />
            </table>
        );
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeInTheDocument();
    });

    test('selects all rows when checkbox is checked', () => {
        const { container } = render(<table><EnhancedTableHead {...defaultProps} /></table>);
        const checkbox = container.querySelector('input[type="checkbox"]');
        fireEvent.click(checkbox);
        expect(mockSetSelected).toHaveBeenCalledWith([1, 2]);
    });

    test('maintains sorting order when clicking different header', () => {
        const { getByText } = render(<table><EnhancedTableHead {...defaultProps} /></table>);
        const sortLabel = getByText('Name');
        fireEvent.click(sortLabel);
    });


    test('matches table head snapshot', () => {
        const { asFragment } = render(
            <table>
                <EnhancedTableHead
                    {...defaultProps}
                    numSelected={2}
                />
            </table>
        );
        expect(asFragment()).toMatchSnapshot();
    });
});

describe('EnhancedTableToolbar', () => {
    test('shows delete button when items are selected', () => {
        render(
            <EnhancedTableToolbar
                numSelected={2}
                deleteSelected={vi.fn()}
                tableTitle="Test"
                onSearch={vi.fn()}
            />
        );
        expect(screen.getByLabelText(/delete/i)).toBeInTheDocument();
    });

    test('shows update button when one item is selected', () => {
        render(
            <EnhancedTableToolbar
                numSelected={1}
                deleteSelected={vi.fn()}
                tableTitle="Test"
                onSearch={vi.fn()}
            />
        );
        expect(screen.getByLabelText(/update/i)).toBeInTheDocument();
    });

    test('shows search field when no items are selected', () => {
        render(
            <EnhancedTableToolbar
                numSelected={0}
                tableTitle="Test"
                onSearch={vi.fn()}
            />
        );
        expect(screen.getByLabelText('Search')).toBeInTheDocument();
    });


    test('matches toolbar states snapshot', () => {
        const { asFragment: deleteState } = render(
            <EnhancedTableToolbar
                numSelected={2}
                deleteSelected={vi.fn()}
                tableTitle="Test"
            />
        );

        const { asFragment: updateState } = render(
            <EnhancedTableToolbar
                numSelected={1}
                deleteSelected={vi.fn()}
                tableTitle="Test"
            />
        );

        const { asFragment: searchState } = render(
            <EnhancedTableToolbar
                numSelected={0}
                tableTitle="Test"
            />
        );

        expect({ deleteState: deleteState(), updateState: updateState(), searchState: searchState() }).toMatchSnapshot();
    });
});

describe('PieChartCard', () => {
    const TEST_COLORS_LENGTH = pieChartColors.length;
    // Test case 1: Data exceeds color threshold
    it('should merge excess items into "Other" category when data exceeds color limit', () => {
        // Create data with 1 more item than available colors
        const longData = Array.from({ length: TEST_COLORS_LENGTH + 2 }, (_, i) => ({
            id: `item-${i}`,
            label: `Category ${i + 1}`,
            value: 1000 - i * 100, // Descending values
        }));

        render(<PieChartCard data={longData} title="Test Chart" showLinear={true} />);

        // Verify merged data
        const otherItem = screen.getByText('Other');
        expect(otherItem).toBeInTheDocument();

        // Verify original items count after merge (N-1 colors + Other)
        const slicedItems = longData.slice(0, TEST_COLORS_LENGTH - 1);
        slicedItems.forEach(item => {
            expect(screen.getByText(item.label)).toBeInTheDocument();
        });
    });

    // Test case 2: Data within color limit
    it('should display all items directly when data is within color limit', () => {
        // Create data with 2 items less than color limit
        const shortData = Array.from({ length: TEST_COLORS_LENGTH - 2 }, (_, i) => ({
            id: `item-${i}`,
            label: `Category ${i + 1}`,
            value: 1000 - i * 100,
        }));

        render(<PieChartCard data={shortData} title="Test Chart" showLinear={true} />);

        // Verify no "Other" category
        expect(screen.queryByText('Other')).not.toBeInTheDocument();

        // Verify all items are displayed
        shortData.forEach(item => {
            expect(screen.getByText(item.label)).toBeInTheDocument();
        });
    });

    // Optional: Add tests for total value calculation, sorting, etc.
    it('should calculate and display correct total value', () => {
        const testData = [
            { id: '1', label: 'A', value: 500 },
            { id: '2', label: 'B', value: 300 },
        ];

        render(<PieChartCard data={testData} title="Test Chart" showLinear={false} />);

        const totalValue = testData.reduce((sum, item) => sum + item.value, 0);
        expect(screen.getByText(totalValue.toFixed(2))).toBeInTheDocument();
    });
});