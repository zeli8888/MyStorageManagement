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
import { useState } from 'react';
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
import React from 'react';
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