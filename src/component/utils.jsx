import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { useState, Fragment } from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import { Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import { NumericFormat } from 'react-number-format';
import { PieChart } from '@mui/x-charts/PieChart';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useDrawingArea } from '@mui/x-charts/hooks';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
export function NumberInput(props) {
    const { defaultValue, prefix } = props;
    const [value, setValue] = useState(defaultValue);
    return <NumericFormat customInput={TextField} prefix={prefix} value={value} onValueChange={({ floatValue }) => setValue(floatValue)} {...props} />;
}

export function RememberMeCheckbox(props) {
    const theme = useTheme();
    const { rememberMe, setRememberMe, sx } = props;

    return (
        <FormControlLabel
            sx={{
                marginRight: 0,
                flexShrink: 0,
                '& .MuiFormControlLabel-label': {
                    fontSize: theme.typography.pxToRem(14),
                    [theme.breakpoints.down('sm')]: {
                        fontSize: theme.typography.pxToRem(12)
                    }
                },
                ...sx
            }}
            label="Remember me"
            control={
                <Checkbox
                    name="remember"
                    value="true"
                    color="primary"
                    size="small"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{
                        padding: { xs: 0.25, sm: 0.5 },
                        '& .MuiSvgIcon-root': {
                            fontSize: { xs: 18, sm: 20 }
                        }
                    }}
                />
            }
            slotProps={{
                typography: {
                    component: 'span',
                    sx: {
                        whiteSpace: 'nowrap'
                    }
                }
            }}
        />
    );
}

export function DeletionConfirmationComponent(props) {
    const { onClose, warningMessage, open, onConfirm } = props;

    return (
        <Dialog onClose={onClose} open={open}>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    {warningMessage}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onConfirm}>Yes</Button>
            </DialogActions>
        </Dialog>
    );
}

DeletionConfirmationComponent.propTypes = {
    open: PropTypes.bool.isRequired,
    warningMessage: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
};

export function SearchComponent(props) {
    const { onSearch, sx } = props;
    const [searchText, setSearchText] = useState('');
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            onSearch(searchText);
        }
    };
    return (
        <TextField
            label="Search"
            variant="outlined"
            size="small"
            fullWidth
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            onKeyDown={handleKeyDown}
            slotProps={{
                input: {
                    endAdornment: (
                        <IconButton type="button" aria-label="search" size="small" onClick={(event) => onSearch(searchText)}>
                            <SearchIcon />
                        </IconButton>
                    ),
                    sx: { pr: 0.5 },
                },
            }}
            sx={[{ display: 'inline-block' }, sx]}
        />);
}


export function getVisibleRows(rows, order, orderBy, page, rowsPerPage,
    descendingComparator = (a, b, orderBy) => {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }) {

    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }
    return [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}

export const handleClick = (event, id, selected, setSelected) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
        // new selected
        newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
        // disable first selected
        newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
        // disable last selected
        newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
        // disable selected in the middle
        newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
        );
    }
    setSelected(newSelected);
};

export function EnhancedTableHead(props) {
    const { order, orderBy, setOrder, setOrderBy, numSelected, headCells, rows, setSelected, idAttributeName } =
        props;
    const createSortHandler = (property) => (event) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const rowCount = rows.length;

    const onSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n[idAttributeName]);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.sortingEnabled && <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>}
                        {!headCell.sortingEnabled && headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export function EnhancedTableToolbar(props) {
    const { numSelected, deleteSelected, updateSelected, onSearch, tableTitle } = props;
    return (
        <Toolbar
            sx={[
                numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                },
                { width: '100%' },
            ]}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ width: '100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Stack direction="row" sx={{ width: '100%' }}>
                    <Typography
                        sx={{ flex: '1 1' }}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        {tableTitle}
                    </Typography>
                    <SearchComponent sx={{ flex: '3 3' }} onSearch={onSearch} />
                </Stack>
            )}
            {numSelected === 1 && (
                <Tooltip title="Update">
                    <IconButton>
                        <EditIcon onClick={updateSelected} />
                    </IconButton>
                </Tooltip>
            )}
            {numSelected > 0 && (
                <Tooltip title="Delete">
                    <IconButton>
                        <DeleteIcon onClick={deleteSelected} />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
}

const StyledText = styled('text', {
    shouldForwardProp: (prop) => prop !== 'variant',
})(
    ({ theme }) => ({
        textAnchor: 'middle',
        dominantBaseline: 'central',
        fill: (theme.vars || theme).palette.text.secondary,
        variants: [
            {
                props: { variant: 'primary' },
                style: { fontSize: theme.typography.h5.fontSize },
            },
            {
                props: ({ variant }) => variant !== 'primary',
                style: { fontSize: theme.typography.body2.fontSize },
            },
            {
                props: { variant: 'primary' },
                style: { fontWeight: theme.typography.h5.fontWeight },
            },
            {
                props: ({ variant }) => variant !== 'primary',
                style: { fontWeight: theme.typography.body2.fontWeight },
            },
        ],
    })
);

function PieCenterLabel({ primaryText, secondaryText }) {
    const { width, height, left, top } = useDrawingArea();
    const primaryY = top + height / 2 - 10;
    const secondaryY = primaryY + 24;

    return (
        <Fragment>
            <StyledText variant="primary" x={left + width / 2} y={primaryY}>
                {primaryText}
            </StyledText>
            <StyledText variant="secondary" x={left + width / 2} y={secondaryY}>
                {secondaryText}
            </StyledText>
        </Fragment>
    );
}

const pieChartColors = [
    '#FF6B6B',
    '#4ECDC4',
    '#FFD93D',
    '#6C5CE7',
    '#FFA726',
    '#2ECC71',
    '#E84393',
    'lightgray'
];


export function PieChartCard(props) {
    const {
        data,
        showLinear,
        title,
    } = props;
    // fake test data
    // const data = Array.from({ length: 20 }, (_, i) => ({
    //     id: `item-${i + 1}`,
    //     label: `Category ${String.fromCharCode(65 + (i % 26))}${i > 25 ? Math.floor(i / 26) + 1 : ''}`, // 生成 A-Z, AA-AZ...
    //     value: Math.floor(10000 * Math.pow(0.85, i) * (1 + Math.random() * 0.3))
    // }));

    // Sort data by value in descending order
    const sortedData = [...data].sort((a, b) => b.value - a.value);

    // Handle data merging logic
    const shouldMerge = sortedData.length > pieChartColors.length - 1;
    const displayData = shouldMerge
        ? [
            ...sortedData.slice(0, pieChartColors.length - 1), // First main items
            {
                id: 'other',
                label: 'Other',
                value: sortedData.slice(pieChartColors.length - 1).reduce((acc, item) => acc + item.value, 0)
            }
        ]
        : sortedData;

    const totalValue = displayData.reduce((acc, item) => acc + item.value, 0);
    return (
        <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <CardContent>
                <Typography component="h2" variant="subtitle2">{title}</Typography>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PieChart
                        colors={pieChartColors}
                        series={[{
                            data: displayData,
                            innerRadius: 40,
                            outerRadius: 75,
                            paddingAngle: 0,
                            // arcLabel: 'value'
                        }]}
                        height={150}
                        width={150}
                        hideLegend
                    >
                        {displayData.length > 0 && <PieCenterLabel primaryText={totalValue.toFixed(2)} secondaryText="Total" />}
                    </PieChart>
                </Box>

                {showLinear && displayData.map((item, index) => {
                    const percentage = ((item.value / totalValue) * 100).toFixed(2);
                    return (
                        <Stack sx={{ gap: 1, flexGrow: 1 }} key={item.id} direction={'column'}>
                            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                                <Stack direction="row" sx={{
                                    alignItems: 'baseline',
                                    flexShrink: 1,
                                    minWidth: 0,
                                }}>
                                    <Typography variant="body2" sx={{
                                        fontWeight: 500,
                                        pr: 0.5
                                    }}>
                                        {item.label}
                                    </Typography>
                                    <Typography variant="caption" sx={{
                                        color: 'text.secondary',
                                    }}>
                                        ({percentage}%)
                                    </Typography>
                                </Stack>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {item.value.toFixed(2)}
                                </Typography>
                            </Stack>
                            <LinearProgress
                                variant="determinate"
                                value={percentage}
                                sx={{
                                    [`& .${linearProgressClasses.bar}`]: {
                                        backgroundColor: pieChartColors[index > pieChartColors.length - 1 ? pieChartColors.length - 1 : index]
                                    }
                                }}
                            />
                        </Stack>
                    );
                })}
            </CardContent>
        </Card>
    );
}
