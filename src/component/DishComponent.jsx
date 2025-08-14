import { useContext, useState, useEffect, useMemo, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import dishService from '../service/DishService'
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
import { DeletionConfirmationComponent, getVisibleRows, handleClick, EnhancedTableToolbar, EnhancedTableHead } from './utils';
import Alert from '@mui/material/Alert';
import TablePagination from '@mui/material/TablePagination';
const DishComponent = function () {
    const navigate = useNavigate();
    const [dishes, setDishes] = useState([]);
    const { allIngredients, setAllDishes } = useContext(FoodContext);
    const [addingDish, setAddingDish] = useState(false);
    const [addingDishRecord, setAddingDishRecord] = useState(false);
    const [dishUpdating, setDishUpdating] = useState();
    const [ingredientsForDish, setIngredientsForDish] = useState([]);
    const [dishAlert, setDishAlert] = useState();
    const [deletingDish, setDeletingDish] = useState(false);
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('dishName');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const visibleRows = useMemo(
        () => getVisibleRows(dishes, order, orderBy, page, rowsPerPage),
        [order, orderBy, page, rowsPerPage, dishes],
    );

    useEffect(() => {
        refreshDishes();
    }, [navigate]);

    const refreshDishes = () => {
        dishService.getAllDishes().then(response => {
            setDishes(response.data);
            setAllDishes(response.data);
        }).catch(error => {
            console.log(error);
        });
    }

    const searchDishes = (searchString) => {
        dishService.searchDishes(searchString).then(response => {
            setDishes(response.data);
        }).catch(error => {
            console.log(error);
        });
    }

    const closeDialog = () => {
        setDishUpdating();
        setAddingDishRecord(false);
        setIngredientsForDish([]);
        setAddingDish(false);
    }

    const updateDish = (data) => {
        dishService.updateDish(data.dishId, data).then(response => {
            closeDialog();
            refreshDishes();
            setDishAlert({ severity: "success", message: "Dish " + data.dish.dishName + " updated successfully!" });
        }).catch(error => {
            console.log(error);
        });
    }

    const addDish = (data) => {
        if (addingDishRecord) return addDishRecord(data);
        let dishIngredientDTO = {
            dish: {
                dishName: data.dishName,
                dishDesc: data.dishDesc,
            },
            ingredientIdQuantityList:
                data.ingredientsForDish.split(',').map(ingredient => ({
                    ingredientName: ingredient,
                    quantity: data[ingredient]
                }))

        }
        if (dishUpdating) {
            dishIngredientDTO["dishId"] = dishUpdating.dishId;
            return updateDish(dishIngredientDTO);
        }
        dishService.addDish(dishIngredientDTO).then(response => {
            closeDialog();
            refreshDishes();
            setDishAlert({ severity: "success", message: "Dish " + data.dishName + " added successfully!" });
        }).catch(error => {
            console.log(error);
        });
    }

    const addDishRecord = (data) => {
        let dishRecordIngredientDTO = {
            dishRecord: {
                dishRecordDesc: data.dishRecordDesc,
                dishRecordTime: new Date(data.dishRecordTime).toISOString(),
                dish: {
                    dishName: data.dishName,
                }
            },
            ingredientIdQuantityList:
                data.ingredientsForDish.split(',').map(ingredient => ({
                    ingredientName: ingredient,
                    quantity: data[ingredient]
                }))
        }

        dishRecordService.addDishRecord(dishRecordIngredientDTO).then(response => {
            closeDialog();
            setDishAlert({ severity: "success", message: "Dish Record for " + data.dishName + " added successfully!" });
        }).catch(error => {
            console.log(error);
        });
    }

    const deleteDishes = (dishIds) => {
        dishService.deleteDishes(dishIds).then(response => {
            setSelected([]);
            refreshDishes();
            setDishAlert({ severity: "success", message: "Dishes deleted successfully!" });
        }).catch(error => {
            console.log(error);
        });
    }

    function CreateDishRow(props) {
        const { dish } = props;
        const [open, setOpen] = useState(false);
        const isItemSelected = selected.includes(dish.dishId);

        return (
            <Fragment>
                <TableRow
                    hover
                    onClick={() => setOpen(!open)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={dish.dishId}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                >
                    <TableCell padding="checkbox">
                        <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            onClick={(event) => handleClick(event, dish.dishId, selected, setSelected)}
                        />
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {dish.dishName}
                    </TableCell>
                    <TableCell>{dish.dishDesc}</TableCell>
                    <TableCell>
                        <Button variant="contained" color="info" onClick={
                            () => {
                                setDishUpdating(dish);
                                setIngredientsForDish(dish.dishIngredients.map(dishIngredient => dishIngredient.ingredient.ingredientName));
                                setAddingDishRecord(true);
                                setAddingDish(true);
                            }}>Add</Button>
                    </TableCell>
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
                                    Recipe
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
                                        {dish.dishIngredients.map((dishIngredient) => (
                                            <TableRow key={dishIngredient.ingredient.ingredientId}>
                                                <TableCell component="th" scope="row">
                                                    {dishIngredient.ingredient.ingredientName}
                                                </TableCell>
                                                <TableCell>{dishIngredient.dishIngredientQuantity}</TableCell>
                                                <TableCell>{dishIngredient.ingredient.ingredientStorage}</TableCell>
                                                <TableCell>{dishIngredient.ingredient.ingredientCost}</TableCell>
                                                <TableCell>{dishIngredient.ingredient.ingredientDesc}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </Fragment >
        );
    }

    const addIngredientForDish = (event) => {
        const {
            target: { value },
        } = event;
        setIngredientsForDish(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    }

    const initIngredientAmountForDish = (ingredient) => {
        if (!dishUpdating) return;
        let dishIngredients = dishUpdating.dishIngredients;
        let index = dishIngredients.findIndex(dishIngredient => dishIngredient.ingredient.ingredientName == ingredient)
        if (index == -1) return;
        return dishIngredients[index].dishIngredientQuantity;
    }

    CreateDishRow.propTypes = {
        dish: PropTypes.shape({
            dishId: PropTypes.number.isRequired,
            dishName: PropTypes.string.isRequired,
            dishDesc: PropTypes.string.isRequired,
            dishIngredients: PropTypes.arrayOf(
                PropTypes.shape({
                    dishIngredientQuantity: PropTypes.number.isRequired,
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
            id: 'dishDesc',
            label: 'Description',
            sortingEnabled: true
        },
        {
            id: 'addRecord',
            label: 'Add Record',
            sortingEnabled: false
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
                    {dishAlert && <Alert severity={dishAlert.severity} onClose={() => { setDishAlert(null) }}>{dishAlert.message}</Alert>}
                </Grid>
                <Grid size={12}>
                    <EnhancedTableToolbar numSelected={selected.length} tableTitle="Dishes"
                        deleteSelected={() => setDeletingDish(true)}
                        updateSelected={() => {
                            let dish = dishes.find(dish => dish.dishId == selected[0]);
                            setDishUpdating(dish);
                            setAddingDishRecord(false);
                            setIngredientsForDish(dish.dishIngredients.map(dishIngredient => dishIngredient.ingredient.ingredientName));
                            setAddingDish(true);
                        }}
                        onSearch={(text) => { setPage(0); searchDishes(text); }} />
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
                                rows={dishes}
                                setSelected={setSelected}
                                idAttributeName="dishId"
                                headCells={headCells}
                            />
                            <TableBody>
                                {visibleRows.map((dish) => (
                                    <CreateDishRow key={dish.dishId} dish={dish} />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 15, 20, 25]}
                        component="div"
                        count={dishes.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(event, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(event) => {
                            setRowsPerPage(parseInt(event.target.value, 10));
                            setPage(0);
                        }}
                    />
                </Grid>
                <Button variant="contained" color="success"
                    onClick={() => {
                        setDishUpdating();
                        setAddingDishRecord(false);
                        setIngredientsForDish([]);
                        setAddingDish(true);
                    }}
                    sx={{
                        marginRight: 0,
                        marginLeft: 'auto',
                        marginTop: 1
                    }}
                >
                    New Dish
                </Button>
            </Grid>

            <Dialog
                open={addingDish}
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
                            addDish(formJson);
                        },
                    },
                }}
            >
                <DialogTitle>
                    {dishUpdating ? (addingDishRecord ? "New Record" : "Update Dish") : "New Dish"}
                </DialogTitle>
                <DialogContent>

                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        name="dishName"
                        label="Dish Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={dishUpdating ? dishUpdating.dishName : ""}
                        slotProps={{
                            input: {
                                readOnly: addingDishRecord,
                            },
                        }}
                    />
                    <TextField
                        autoFocus={addingDishRecord}
                        margin="dense"
                        name={addingDishRecord ? "dishRecordDesc" : "dishDesc"}
                        label={addingDishRecord ? "Record Description" : "Dish Description"}
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={dishUpdating ? dishUpdating.dishDesc : ""}
                    />
                    {addingDishRecord && <TextField
                        margin="dense"
                        name="dishRecordTime"
                        label="Record Time"
                        type="datetime-local"
                        fullWidth
                        variant="standard"
                        defaultValue={moment(new Date()).format('YYYY-MM-DD HH:mm')}
                    />}
                    <Box mt={4} />
                    <InputLabel id="add-ingredient-for-dish">{addingDishRecord ? "Ingredients Used" : "Recipe"}</InputLabel>
                    <Select
                        name="ingredientsForDish"
                        labelId="add-ingredient-for-dish"
                        multiple
                        value={ingredientsForDish}
                        onChange={addIngredientForDish}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={{
                            PaperProps: { style: { maxHeight: '45%' } }
                        }}
                        style={{ width: '100%' }}
                    >
                        {allIngredients.map((ingredient) => (
                            <MenuItem key={ingredient.ingredientId} value={ingredient.ingredientName}>
                                <Checkbox checked={ingredientsForDish.includes(ingredient.ingredientName)} />
                                <ListItemText primary={ingredient.ingredientName} />
                            </MenuItem>
                        ))}
                    </Select>
                    <Grid container spacing={2} >
                        {ingredientsForDish.map((ingredient) => {
                            return (
                                <TextField
                                    key={ingredient}
                                    name={ingredient}
                                    label={ingredient + " Amount"}
                                    variant="standard"
                                    color="success"
                                    margin="dense"
                                    type="number"
                                    defaultValue={initIngredientAmountForDish(ingredient)}
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

            <DeletionConfirmationComponent warningMessage={deletingDish ? "Are you sure you want to delete selected " + (selected.length > 1 ? selected.length + " dishes?" : "dish?") : "Processing"}
                open={deletingDish} onClose={() => setDeletingDish(false)}
                onConfirm={() => {
                    deleteDishes(selected);
                    setDeletingDish(false);
                }} />
        </Box>
    )
}

export default DishComponent;