import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ingredientService from '../service/IngredientService'
import { FoodContext } from './FoodProvider';
import { DeletionConfirmationComponent, EnhancedTableToolbar, NumberInput } from './utils';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import moment from 'moment';
import InputLabel from '@mui/material/InputLabel';
import dishRecordService from '../service/DishRecordService'

const ModalContentIngredients = function (props) {
    const { ingredientUpdating } = props;
    return (
        <div>
            <DialogTitle>{ingredientUpdating ? "Update Ingredient" : "New Ingredient"}</DialogTitle>
            <DialogContent>
                {ingredientUpdating && <input type="hidden" name="ingredientId" value={ingredientUpdating.ingredientId} />}
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    name="ingredientName"
                    label="Ingredient Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    defaultValue={ingredientUpdating ? ingredientUpdating.ingredientName : ""}
                />
                <NumberInput
                    required
                    margin="dense"
                    name="ingredientStorage"
                    label="Ingredient Storage"
                    // NumericFormat props 
                    thousandSeparator
                    decimalScale={2}
                    fixedDecimalScale
                    //
                    fullWidth
                    variant="standard"
                    defaultValue={ingredientUpdating ? ingredientUpdating.ingredientStorage : ""}
                />
                <NumberInput
                    margin="dense"
                    name="ingredientCost"
                    label="Ingredient Cost"
                    // NumericFormat props 
                    thousandSeparator
                    decimalScale={2}
                    fixedDecimalScale
                    //
                    fullWidth
                    variant="standard"
                    defaultValue={ingredientUpdating ? ingredientUpdating.ingredientCost : ""}
                />
                <TextField
                    margin="dense"
                    name="ingredientDesc"
                    label="Ingredient Description"
                    type="text"
                    fullWidth
                    variant="standard"
                    defaultValue={ingredientUpdating ? ingredientUpdating.ingredientDesc : ""}
                />
            </DialogContent>
        </div>
    )
}

const ModalContentRecord = function (props) {
    const { ingredientIdsForRecord, ingredients } = props;
    const ingredientNamesForRecord = ingredientIdsForRecord.map(
        ingredientId => ingredients.find(ingredient => ingredient.ingredientId == ingredientId).ingredientName
    );
    return (
        <div>
            <DialogTitle>New Record</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus={false}
                    margin="dense"
                    name={"dishRecordDesc"}
                    label={"Record Description"}
                    type="text"
                    fullWidth
                    variant="standard"
                    defaultValue={ingredientNamesForRecord.join(", ")}
                />
                <TextField
                    margin="dense"
                    name="dishRecordTime"
                    label="Record Time"
                    type="datetime-local"
                    fullWidth
                    variant="standard"
                    defaultValue={moment(new Date()).format('YYYY-MM-DD HH:mm')}
                />
                <Box mt={4} />
                <InputLabel id="add-ingredient-for-record">{"Ingredients Used"}</InputLabel>
                <Grid container spacing={2} >
                    {ingredientIdsForRecord.map((ingredientId, index) => {
                        const ingredientName = ingredientNamesForRecord[index];
                        return (
                            <div key={'ingredient-' + ingredientId}>
                                <input type="hidden" name={'ingredientName-' + ingredientId} value={ingredientName} />
                                <NumberInput
                                    name={'ingredientAmount-' + ingredientId}
                                    label={ingredientName + " Amount"}
                                    variant="standard"
                                    color="success"
                                    margin="dense"
                                    // NumericFormat props 
                                    thousandSeparator
                                    decimalScale={2}
                                    fixedDecimalScale
                                    defaultValue={1}
                                    required
                                />
                            </div>
                        );
                    })}
                </Grid>
            </DialogContent>
        </div>
    )
}

const IngredientsModal = function (props) {
    const { open, addingDishRecord, ingredientUpdating, ingredientIdsForRecord, ingredients, onClose, onSubmit } = props;
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth={true}
            slotProps={{
                paper: {
                    component: 'form',
                    onSubmit: onSubmit,
                },
            }}
        >
            {!addingDishRecord ?
                <ModalContentIngredients ingredientUpdating={ingredientUpdating} /> :
                <ModalContentRecord ingredientIdsForRecord={ingredientIdsForRecord} ingredients={ingredients} />
            }

            <DialogActions>
                <Button onClick={onClose} data-testid="modal-cancel-button">Cancel</Button>
                <Button type="submit">Save</Button>
            </DialogActions>
        </Dialog>)
}

const IngredientComponent = function () {
    const navigate = useNavigate();
    const [ingredients, setIngredients] = useState([]);
    const { setAllIngredients } = useContext(FoodContext);
    const [ingredientUpdating, setIngredientUpdating] = useState();
    const [openModal, setOpenModal] = useState(false);
    const [ingredientAlert, setIngredientAlert] = useState();
    const [selected, setSelected] = useState([]);
    const [deletingIngredient, setDeletingIngredient] = useState(false);
    const [addingDishRecord, setAddingDishRecord] = useState(false);

    useEffect(() => {
        refreshIngredients();
    }, [navigate]);

    const addDishRecord = (data) => {
        let dishRecordIngredientDTO = {
            dishRecord: {
                dishRecordDesc: data.dishRecordDesc,
                dishRecordTime: new Date(data.dishRecordTime).toISOString(),
            },
            ingredientIdQuantityList:
                selected.map(ingredientId => ({
                    ingredientName: data['ingredientName-' + ingredientId],
                    quantity: data['ingredientAmount-' + ingredientId]
                }))
        }

        dishRecordService.addDishRecord(dishRecordIngredientDTO).then(response => {
            setAddingDishRecord(false);
            setOpenModal(false);
            refreshIngredients();
            setIngredientAlert({ severity: "success", message: "Record added successfully!" });
        }).catch(error => {
            console.log(error);
        });
    }

    const refreshIngredients = () => {
        ingredientService.getAllIngredients().then(response => {
            setIngredients(response.data);
            setAllIngredients(response.data);
        }).catch(error => {
            console.log(error);
        });
    }

    const searchIngredients = (searchText) => {
        ingredientService.searchIngredients(searchText).then(response => {
            setIngredients(response.data);
        }).catch(error => {
            console.log(error);
        });
    }

    const updateIngredient = (data) => {
        ingredientService.updateIngredient(data.ingredientId, data).then(response => {
            setIngredientUpdating();
            setOpenModal(false);
            refreshIngredients();
            setIngredientAlert({ severity: "success", message: "Ingredient " + data.ingredientName + " updated successfully!" });
        }).catch(error => {
            console.log(error);
        });
    }

    const addIngredient = (data) => {
        if (addingDishRecord) return addDishRecord(data);
        if (ingredientUpdating) return updateIngredient(data);
        ingredientService.addIngredient(data).then(response => {
            setOpenModal(false);
            refreshIngredients();
            setIngredientAlert({ severity: "success", message: "Ingredient " + data.ingredientName + " added successfully!" });
        }).catch(error => {
            console.log(error);
        });
    }

    const deleteIngredients = (ingredientIds) => {
        ingredientService.deleteIngredients(ingredientIds).then(response => {
            refreshIngredients();
            setIngredientAlert({ severity: "success", message: "Ingredients deleted successfully!" });
        }).catch(error => {
            console.log(error);
        });
    }

    const columns = [
        {
            field: 'ingredientId',
            headerName: 'Id',
            with: 0,
            editable: false,
            headerAlign: 'center'
        },
        {
            field: 'ingredientName',
            headerName: 'Ingredient',
            flex: 2,
            editable: false,
            headerAlign: 'center'
        },
        {
            field: 'ingredientStorage',
            headerName: 'Storage',
            flex: 2,
            type: 'number',
            editable: false,
            headerAlign: 'center'
        },
        {
            field: 'ingredientCost',
            headerName: 'Cost',
            flex: 2,
            type: 'number',
            editable: false,
            headerAlign: 'center'
        },
        {
            field: 'ingredientDesc',
            headerName: 'Description',
            flex: 3,
            editable: false,
            headerAlign: 'center'
        }
    ];

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={0} >
                <Grid size={12}>
                    {ingredientAlert && <Alert severity={ingredientAlert.severity} onClose={() => { setIngredientAlert(null) }}>{ingredientAlert.message}</Alert>}
                </Grid>
                <Grid size={12}>
                    <EnhancedTableToolbar numSelected={selected.length} tableTitle="Ingredients"
                        deleteSelected={() => setDeletingIngredient(true)}
                        updateSelected={() => {
                            let ingredient = ingredients.find(ingredient => ingredient.ingredientId == selected[0]);
                            setIngredientUpdating(ingredient);
                            setOpenModal(true);
                        }}
                        onSearch={(text) => { searchIngredients(text); }} />
                </Grid>
                <Grid size={12}>
                    <DataGrid
                        autoWidth
                        rows={ingredients}
                        selectionModel={selected}
                        onRowSelectionModelChange={
                            (newSelection) =>
                                newSelection.type === 'include' ? setSelected([...newSelection.ids]) :
                                    setSelected(ingredients.filter(ingredient => !newSelection.ids.has(ingredient.ingredientId)).map(ingredient => ingredient.ingredientId))
                        }
                        columns={columns}
                        initialState={{
                            sorting: {
                                sortModel: [{
                                    field: 'ingredientStorage',
                                    sort: 'asc',
                                }],
                            },
                            columns: {
                                columnVisibilityModel: {
                                    ingredientId: false,
                                },
                            },
                            pagination: {
                                paginationModel: {
                                    pageSize: 10,
                                },
                            },
                        }}
                        pageSizeOptions={[5, 10, 15, 20, 25]}
                        checkboxSelection
                        getRowId={(row) => row.ingredientId}
                        sx={{
                            boxShadow: 2,
                            border: 2,
                            borderColor: 'lightgrey',
                            width: '100%',
                            '& .MuiDataGrid-cell': {
                                textAlign: 'center', // Center the text in each cell
                            }
                        }}
                    />
                </Grid>
                {selected.length > 0 && <Button variant="contained" color="info"
                    onClick={() => {
                        setAddingDishRecord(true);
                        setOpenModal(true);
                    }}
                    sx={{
                        marginLeft: 0,
                        marginRight: 'auto',
                        marginTop: 1
                    }}
                >
                    Add Record
                </Button>}
                <Button variant="contained" color="success"
                    onClick={() => {
                        setOpenModal(true);
                    }}
                    sx={{
                        marginRight: 0,
                        marginLeft: 'auto',
                        marginTop: 1
                    }}
                >
                    New Ingredient
                </Button>
            </Grid>
            <IngredientsModal open={openModal} ingredientUpdating={ingredientUpdating} addingDishRecord={addingDishRecord} ingredientIdsForRecord={selected} ingredients={ingredients}
                onClose={() => {
                    setIngredientUpdating();
                    setAddingDishRecord(false);
                    setOpenModal(false);
                }}
                onSubmit={(event) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const formJson = Object.fromEntries(formData.entries());
                    addIngredient(formJson);
                }}
            />
            <DeletionConfirmationComponent warningMessage={deletingIngredient ? "Are you sure you want to delete selected " + (selected.length > 1 ? selected.length + " ingredients?" : "ingredient?") : "Processing"}
                open={deletingIngredient} onClose={() => setDeletingIngredient(false)}
                onConfirm={() => {
                    deleteIngredients(selected);
                    setDeletingIngredient(false);
                }} />
        </Box>
    )
}

export default IngredientComponent;