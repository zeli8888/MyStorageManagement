import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DishService from '../service/DishService'
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

const DishComponent = function () {
    const navigate = useNavigate();
    const { ingredients, setIngredients, dishes, setDishes } = React.useContext(FoodContext);
    // const [dishes, setDishes] = useState([]);
    const [addingDish, setAddingDish] = useState(false);

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

    const updateDish = (data) => {
        DishService.updateDish(data.dishId, data).then(response => {
            refreshDishes();
        }).catch(error => {
            console.log(error);
        });
    }

    const addDish = (data) => {
        DishService.addDish(data).then(response => {
            setAddingDish(false);
            refreshDishes();
        }).catch(error => {
            console.log(error);
        });
    }

    const deleteDish = (dishId) => {
        DishService.deleteDish(dishId).then(response => {
            refreshDishes();
        }).catch(error => {
            console.log(error);
        });
    }

    function CreateDishRow(props) {
        const { dish } = props;
        const [open, setOpen] = React.useState(false);

        return (
            <React.Fragment>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
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
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Recipe
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell align="right">Amount</TableCell>
                                            <TableCell align="right">Storage</TableCell>
                                            <TableCell align="right">Cost</TableCell>
                                            <TableCell>Description</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {dish.dishIngredients.map((dishIngredient) => (
                                            <TableRow key={dishIngredient.ingredient.ingredientId}>
                                                <TableCell component="th" scope="row">
                                                    {dishIngredient.ingredient.ingredientName}
                                                </TableCell>
                                                <TableCell align="right">{dishIngredient.dishIngredientQuantity}</TableCell>
                                                <TableCell align="right">{dishIngredient.ingredient.ingredientStorage}</TableCell>
                                                <TableCell align="right">{dishIngredient.ingredient.ingredientCost}</TableCell>
                                                <TableCell>{dishIngredient.ingredient.ingredientDesc}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment>
        );
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
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Dish</TableCell>
                            <TableCell>Description</TableCell>
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
                    setAddingDish(true);
                }}
            >
                New Dish
            </Button>

            <Dialog
                open={addingDish}
                onClose={() => { setAddingDish(false) }}
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
                <DialogTitle>New Dish</DialogTitle>
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
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        name="dishDesc"
                        label="Dish Description"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setAddingDish(false) }}>Cancel</Button>
                    <Button type="submit">Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default DishComponent;