import { useContext, useState, useEffect, useMemo, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import dishRecordService from '../service/DishRecordService'
import { FoodContext } from './FoodProvider';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid'
import moment from 'moment';
import { DeletionConfirmationComponent, EnhancedTableToolbar, EnhancedTableHead, handleClick, getVisibleRows, NumberInput } from './utils';
import Alert from '@mui/material/Alert';
import TablePagination from '@mui/material/TablePagination';
const DishRecordComponent = function () {
    const navigate = useNavigate();
    const { allIngredients, allDishes } = useContext(FoodContext);
    const [dishRecords, setDishRecords] = useState([]);
    const [dishRecordUpdating, setDishRecordUpdating] = useState();
    const [ingredientsForDishRecord, setIngredientsForDishRecord] = useState([]);
    const [dishNameForDishRecord, setDishNameForDishRecord] = useState('');
    const [deletingDishRecord, setDeletingDishRecord] = useState(false);
    const [dishRecordAlert, setDishRecordAlert] = useState();
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('dishRecordTime');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchString, setSearchString] = useState('');

    // page set to 0 to use server-side pagination, won't slice the data
    const visibleRows = useMemo(
        () => getVisibleRows(dishRecords, order, orderBy, 0, rowsPerPage,
            (a, b, orderBy) => {
                if (orderBy === 'dishName') {
                    b = b.dish;
                    a = a.dish;
                }
                if (b[orderBy] < a[orderBy]) {
                    return -1;
                }
                if (b[orderBy] > a[orderBy]) {
                    return 1;
                }
                return 0;
            }
        ),
        [order, orderBy, rowsPerPage, dishRecords],
    );

    useEffect(() => {
        refreshDishRecords();
    }, [navigate, page, rowsPerPage, searchString]);

    const refreshDishRecords = () => {
        dishRecordService.searchDishRecords(searchString, page, rowsPerPage).then(response => {
            setSelected([]);
            setDishRecords(response.data.content);
            setTotalElements(response.data.totalElements);
        }).catch(error => {
            console.log(error);
        });
    }

    const closeDialog = () => {
        setDishRecordUpdating();
        setDishNameForDishRecord('');
        setIngredientsForDishRecord([]);
    }

    const updateDishRecord = (data) => {
        let dishRecordIngredientDTO = {
            dishRecord: {
                dishRecordDesc: data.dishRecordDesc,
                dishRecordTime: new Date(data.dishRecordTime).toISOString(),
                dish: data.dishNameForDishRecord == "" ? null : {
                    dishName: data.dishNameForDishRecord,
                }
            },
            ingredientIdQuantityList:
                data.ingredientsForDishRecord.split(',').map(ingredient => ({
                    ingredientName: ingredient,
                    quantity: data[ingredient]
                }))
        }

        dishRecordService.updateDishRecord(dishRecordUpdating.dishRecordId, dishRecordIngredientDTO).then(response => {
            closeDialog();
            refreshDishRecords();
            setDishRecordAlert({ severity: "success", message: "Dish Record updated successfully!" });
        }).catch(error => {
            console.log(error);
        });
    }

    const deleteDishRecords = (dishRecordIds) => {
        dishRecordService.deleteDishRecords(dishRecordIds).then(response => {
            setSelected([]);
            refreshDishRecords();
            setDishRecordAlert({ severity: "success", message: "Dish Records deleted successfully!" });
        }).catch(error => {
            console.log(error);
        });
    }

    function CreateDishRecordRow(props) {
        const { dishRecord } = props;
        const [open, setOpen] = useState(false);
        const isItemSelected = selected.includes(dishRecord.dishRecordId);

        return (
            <Fragment>
                <TableRow
                    hover
                    onClick={() => setOpen(!open)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={dishRecord.dishRecordId}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                >
                    <TableCell padding="checkbox">
                        <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            onClick={(event) => handleClick(event, dishRecord.dishRecordId, selected, setSelected)}
                        />
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {dishRecord.dish ? dishRecord.dish.dishName : ""}
                    </TableCell>
                    <TableCell>{dishRecord.dishRecordDesc}</TableCell>
                    <TableCell>{moment(dishRecord.dishRecordTime).format('YYYY-MM-DD HH:mm')}</TableCell>
                    <TableCell>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                <Typography variant="h6" gutterBottom component="div" textAlign={"left"}>
                                    Ingredients Used
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Amount</TableCell>
                                            <TableCell>Storage</TableCell>
                                            <TableCell>Cost</TableCell>
                                            <TableCell>Description</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {dishRecord.dishRecordIngredients.map((dishRecordIngredient) => (
                                            <TableRow key={dishRecordIngredient.ingredient.ingredientId}>
                                                <TableCell component="th" scope="row">
                                                    {dishRecordIngredient.ingredient.ingredientName}
                                                </TableCell>
                                                <TableCell>{dishRecordIngredient.dishRecordIngredientQuantity}</TableCell>
                                                <TableCell>{dishRecordIngredient.ingredient.ingredientStorage}</TableCell>
                                                <TableCell>{dishRecordIngredient.ingredient.ingredientCost}</TableCell>
                                                <TableCell>{dishRecordIngredient.ingredient.ingredientDesc}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </Fragment>
        );
    }

    const addIngredientForDishRecord = (event) => {
        const {
            target: { value },
        } = event;
        setIngredientsForDishRecord(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    }

    const initIngredientAmountForDishRecord = (ingredient) => {
        let dishRecordIngredients = dishRecordUpdating.dishRecordIngredients;
        let index = dishRecordIngredients.findIndex(dishRecordIngredient => dishRecordIngredient.ingredient.ingredientName == ingredient)
        if (index == -1) return;
        return dishRecordIngredients[index].dishRecordIngredientQuantity;
    }

    CreateDishRecordRow.propTypes = {
        dishRecord: PropTypes.shape({
            dishRecordId: PropTypes.number.isRequired,
            dishRecordTime: PropTypes.string.isRequired,
            dishRecordDesc: PropTypes.string.isRequired,
            dish: PropTypes.shape({
                dishId: PropTypes.number.isRequired,
                dishName: PropTypes.string.isRequired
            }).isRequired,
            dishRecordIngredients: PropTypes.arrayOf(
                PropTypes.shape({
                    dishRecordIngredientQuantity: PropTypes.number.isRequired,
                    ingredient: PropTypes.shape({
                        ingredientId: PropTypes.number.isRequired,
                        ingredientName: PropTypes.string.isRequired,
                        ingredientStorage: PropTypes.number.isRequired,
                        ingredientCost: PropTypes.number.isRequired,
                        ingredientDesc: PropTypes.string.isRequired,
                    })
                }),
            ).isRequired,
        }).isRequired,
    };

    const headCells = [
        {
            id: 'dishName',
            label: 'Dish Name',
            sortingEnabled: true
        },
        {
            id: 'dishRecordDesc',
            label: 'Description',
            sortingEnabled: true
        },
        {
            id: 'dishRecordTime',
            label: 'Time',
            sortingEnabled: true
        },
        {
            id: 'expand',
            label: '',
            sortingEnabled: false
        },
    ];

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={0} >
                <Grid size={12}>
                    {dishRecordAlert && <Alert severity={dishRecordAlert.severity} onClose={() => { setDishRecordAlert(null) }}>{dishRecordAlert.message}</Alert>}
                </Grid>
                <Grid size={12}>
                    <EnhancedTableToolbar numSelected={selected.length} tableTitle="Dish Records"
                        deleteSelected={() => setDeletingDishRecord(true)}
                        updateSelected={() => {
                            let dishRecord = dishRecords.find(dishRecord => dishRecord.dishRecordId == selected[0]);
                            setDishRecordUpdating(dishRecord);
                            setDishNameForDishRecord(dishRecord.dish ? dishRecord.dish.dishName : "");
                            setIngredientsForDishRecord(dishRecord.dishRecordIngredients.map(dishRecordIngredient => dishRecordIngredient.ingredient.ingredientName));
                        }}
                        onSearch={(text) => { setPage(0); setSearchString(text); }} />
                </Grid>
                <Grid size={12}>
                    <TableContainer component={Paper}>
                        <Table aria-label="collapsible table" sx={{ '& .MuiTableCell-root': { textAlign: 'center' }, border: '2px solid lightgray' }}>
                            <EnhancedTableHead
                                order={order}
                                orderBy={orderBy}
                                setOrder={setOrder}
                                setOrderBy={setOrderBy}
                                numSelected={selected.length}
                                rows={dishRecords}
                                setSelected={setSelected}
                                idAttributeName="dishRecordId"
                                headCells={headCells}
                            />
                            <TableBody>
                                {visibleRows.map((dishRecord) => (
                                    <CreateDishRecordRow key={dishRecord.dishRecordId} dishRecord={dishRecord} />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 15, 20, 25]}
                        component="div"
                        count={totalElements}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(event, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(event) => {
                            setRowsPerPage(parseInt(event.target.value, 10));
                            setPage(0);
                        }}
                    />
                </Grid>
            </Grid>

            <Dialog
                open={dishRecordUpdating}
                onClose={() => {
                    closeDialog();
                }}
                maxWidth="xs"
                fullWidth={true}
                slotProps={{
                    paper: {
                        component: 'form',
                        onSubmit: (event) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries(formData.entries());
                            updateDishRecord(formJson);
                        },
                    },
                }}
            >
                <DialogTitle>Update Dish Record</DialogTitle>
                <DialogContent>
                    <InputLabel id="dish-name-for-dish-record">Dish</InputLabel>
                    <Select
                        name="dishNameForDishRecord"
                        labelId="dish-name-for-dish-record"
                        value={dishNameForDishRecord}
                        onChange={(event) => { setDishNameForDishRecord(event.target.value) }}
                        renderValue={() => dishNameForDishRecord}
                        MenuProps={{
                            PaperProps: { style: { maxHeight: '45%' } }
                        }}
                        style={{ width: '100%' }}
                    >
                        {allDishes.map((dish) => (
                            <MenuItem key={dish.dishId} value={dish.dishName}>
                                <Checkbox checked={dish.dishName == dishNameForDishRecord} />
                                <ListItemText primary={dish.dishName} />
                            </MenuItem>
                        ))}
                    </Select>
                    <TextField
                        margin="dense"
                        name="dishRecordDesc"
                        label="Record Description"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={dishRecordUpdating ? dishRecordUpdating.dishRecordDesc : ''}
                    />
                    <TextField
                        margin="dense"
                        name="dishRecordTime"
                        label="Record Time"
                        type="datetime-local"
                        fullWidth
                        variant="standard"
                        defaultValue={dishRecordUpdating ? moment(dishRecordUpdating["dishRecordTime"]).format('YYYY-MM-DD HH:mm') : ''}
                    />
                    <Box mt={4} />
                    <InputLabel id="add-ingredient-for-DishRecord">Recipe</InputLabel>
                    <Select
                        name="ingredientsForDishRecord"
                        labelId="add-ingredient-for-DishRecord"
                        multiple
                        value={ingredientsForDishRecord}
                        onChange={addIngredientForDishRecord}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={{
                            PaperProps: { style: { maxHeight: '45%' } }
                        }}
                        style={{ width: '100%' }}
                    >
                        {allIngredients.map((ingredient) => (
                            <MenuItem key={ingredient.ingredientId} value={ingredient.ingredientName}>
                                <Checkbox checked={ingredientsForDishRecord.includes(ingredient.ingredientName)} />
                                <ListItemText primary={ingredient.ingredientName} />
                            </MenuItem>
                        ))}
                    </Select>
                    <Grid container spacing={2} >
                        {ingredientsForDishRecord.map((ingredient) => {
                            return (
                                <NumberInput
                                    key={ingredient}
                                    name={ingredient}
                                    label={ingredient + " Amount"}
                                    variant="standard"
                                    color="success"
                                    margin="dense"
                                    // NumericFormat props 
                                    prefix="€"
                                    thousandSeparator
                                    decimalScale={2}
                                    fixedDecimalScale
                                    //
                                    defaultValue={initIngredientAmountForDishRecord(ingredient)}
                                    required
                                />
                            );
                        })}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        closeDialog();
                    }}>Cancel</Button>
                    <Button type="submit">Save</Button>
                </DialogActions>
            </Dialog>

            <DeletionConfirmationComponent warningMessage={deletingDishRecord ? "Are you sure you want to delete selected " + (selected.length > 1 ? selected.length + " dish records?" : "dish record?") : "Processing"}
                open={deletingDishRecord} onClose={() => { setDeletingDishRecord(false) }}
                onConfirm={() => {
                    deleteDishRecords(selected);
                    setDeletingDishRecord(false);
                }} />
        </Box>
    )
}

export default DishRecordComponent;