import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DishService from '../service/DishService'
import DishRecordService from '../service/DishRecordService'
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
import { DeletionConfirmation } from './MyComponents';
import Alert from '@mui/material/Alert';
const DishComponent = function () {
    const navigate = useNavigate();
    const { ingredients, dishes, setDishes } = React.useContext(FoodContext);
    // const [dishes, setDishes] = useState([]);
    const [addingDish, setAddingDish] = useState(false);
    const [addingDishRecord, setAddingDishRecord] = useState(false);
    const [dishUpdating, setDishUpdating] = useState();
    const [ingredientsForDish, setIngredientsForDish] = useState([]);
    const [dishToDelete, setDishToDelete] = useState();
    const [dishAlert, setDishAlert] = useState();

    useEffect(() => {
        refreshDishes();
    }, [navigate]);

    const refreshDishes = () => {
        DishService.getAllDishes().then(response => {
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
        DishService.updateDish(data.dishId, data).then(response => {
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
        DishService.addDish(dishIngredientDTO).then(response => {
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

        DishRecordService.addDishRecord(dishRecordIngredientDTO).then(response => {
            closeDialog();
            setDishAlert({ severity: "success", message: "Dish Record for " + data.dishName + " added successfully!" });
        }).catch(error => {
            console.log(error);
        });
    }

    const deleteDish = (dishId) => {
        DishService.deleteDish(dishId).then(response => {
            refreshDishes();
            setDishAlert({ severity: "success", message: "Dish " + dishToDelete.dishName + " deleted successfully!" });
        }).catch(error => {
            console.log(error);
        });
    }

    function CreateDishRow(props) {
        const { dish } = props;
        const [open, setOpen] = React.useState(false);

        return (
            <React.Fragment>
                <TableRow>
                    <TableCell>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {dish.dishName}
                    </TableCell>
                    <TableCell>{dish.dishDesc}</TableCell>
                    <TableCell>
                        <Button variant="contained" color="success" onClick={
                            () => {
                                setDishUpdating(dish);
                                setAddingDishRecord(false);
                                setIngredientsForDish(dish.dishIngredients.map(dishIngredient => dishIngredient.ingredient.ingredientName));
                                setAddingDish(true);
                            }}>Update</Button>
                    </TableCell>
                    <TableCell>
                        <Button variant="contained" color="error" onClick={
                            () => setDishToDelete(dish)}> Delete </Button>
                    </TableCell>
                    <TableCell>
                        <Button variant="contained" color="info" onClick={
                            () => {
                                setDishUpdating(dish);
                                setIngredientsForDish(dish.dishIngredients.map(dishIngredient => dishIngredient.ingredient.ingredientName));
                                setAddingDishRecord(true);
                                setAddingDish(true);
                            }}>Add</Button>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
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
            </React.Fragment >
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

    return (
        <div className="container">
            {dishAlert && <Alert severity={dishAlert.severity} onClose={() => { setDishAlert(null) }}>{dishAlert.message}</Alert>}
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table" sx={{ '& .MuiTableCell-root': { textAlign: 'center' } }}>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Dish</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Update</TableCell>
                            <TableCell>Delete</TableCell>
                            <TableCell>Add</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dishes.map((dish) => (
                            <CreateDishRow key={dish.dishId} dish={dish} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Button variant="contained" color="success"
                onClick={() => {
                    setDishUpdating();
                    setAddingDishRecord(false);
                    setIngredientsForDish([]);
                    setAddingDish(true);
                }}
            >
                New Dish
            </Button>

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
                        {ingredients.map((ingredient) => (
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

            <DeletionConfirmation warningMessage={dishToDelete ? "Are you sure you want to delete dish " + dishToDelete.dishName + "?" : "Processing"}
                open={dishToDelete} onClose={() => setDishToDelete(null)}
                onConfirm={() => {
                    deleteDish(dishToDelete.dishId);
                    setDishToDelete(null);
                }} />
        </div >
    )
}

export default DishComponent;