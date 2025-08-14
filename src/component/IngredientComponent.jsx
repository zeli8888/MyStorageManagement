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
import { DeletionConfirmationComponent, EnhancedTableToolbar } from './utils';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
const IngredientComponent = function () {
    const navigate = useNavigate();
    const [ingredients, setIngredients] = useState([]);
    const { setAllIngredients } = useContext(FoodContext);
    const [ingredientUpdating, setIngredientUpdating] = useState();
    const [addingIngredient, setAddingIngredient] = useState(false);
    const [ingredientAlert, setIngredientAlert] = useState();
    const [selected, setSelected] = useState([]);
    const [deletingIngredient, setDeletingIngredient] = useState(false);

    useEffect(() => {
        refreshIngredients();
    }, [navigate]);

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
            setAddingIngredient(false);
            refreshIngredients();
            setIngredientAlert({ severity: "success", message: "Ingredient " + data.ingredientName + " updated successfully!" });
        }).catch(error => {
            console.log(error);
        });
    }

    const addIngredient = (data) => {
        if (ingredientUpdating) return updateIngredient(data);
        ingredientService.addIngredient(data).then(response => {
            setAddingIngredient(false);
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
                            setAddingIngredient(true);
                        }}
                        onSearch={(text) => { searchIngredients(text); }} />
                </Grid>
                <Grid size={12}>
                    <DataGrid
                        autoWidth
                        rows={ingredients}
                        selectionModel={selected}
                        onRowSelectionModelChange={(newSelection) => setSelected([...newSelection.ids])}
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
                <Button variant="contained" color="success"
                    onClick={() => {
                        setIngredientUpdating();
                        setAddingIngredient(true);
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
            <Dialog
                open={addingIngredient}
                onClose={() => {
                    setIngredientUpdating();
                    setAddingIngredient(false);
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
                            addIngredient(formJson);
                        },
                    },
                }}
            >
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
                    <TextField
                        required
                        margin="dense"
                        name="ingredientStorage"
                        label="Ingredient Storage"
                        type="number"
                        fullWidth
                        variant="standard"
                        defaultValue={ingredientUpdating ? ingredientUpdating.ingredientStorage : ""}
                    />
                    <TextField
                        margin="dense"
                        name="ingredientCost"
                        label="Ingredient Cost"
                        type="number"
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
                <DialogActions>
                    <Button onClick={() => {
                        setAddingIngredient(false);
                        setAddingIngredient(false);
                    }}>Cancel</Button>
                    <Button type="submit">Save</Button>
                </DialogActions>
            </Dialog>
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