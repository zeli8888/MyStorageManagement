import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IngredientService from '../service/IngredientService'
import { FoodContext } from './FoodProvider';
import { DeletionConfirmationComponent, SearchComponent } from './MyComponents';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
const IngredientComponent = function () {
    const navigate = useNavigate();
    const [ingredients, setIngredients] = useState([]);
    const { setAllIngredients } = React.useContext(FoodContext);
    const [ingredientUpdating, setIngredientUpdating] = useState();
    const [addingIngredient, setAddingIngredient] = useState(false);
    const [ingredientToDelete, setIngredientToDelete] = useState();
    const [ingredientAlert, setIngredientAlert] = useState();

    useEffect(() => {
        refreshIngredients();
    }, [navigate]);

    const refreshIngredients = () => {
        IngredientService.getAllIngredients().then(response => {
            setIngredients(response.data);
            setAllIngredients(response.data);
        }).catch(error => {
            console.log(error);
        });
    }

    const searchIngredients = (searchText) => {
        IngredientService.searchIngredients(searchText).then(response => {
            setIngredients(response.data);
        }).catch(error => {
            console.log(error);
        });
    }

    const updateIngredient = (data) => {
        IngredientService.updateIngredient(data.ingredientId, data).then(response => {
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
        IngredientService.addIngredient(data).then(response => {
            setAddingIngredient(false);
            refreshIngredients();
            setIngredientAlert({ severity: "success", message: "Ingredient " + data.ingredientName + " added successfully!" });
        }).catch(error => {
            console.log(error);
        });
    }

    const deleteIngredient = (ingredientId) => {
        IngredientService.deleteIngredient(ingredientId).then(response => {
            refreshIngredients();
            setIngredientAlert({ severity: "success", message: "Ingredient " + ingredientToDelete.ingredientName + " deleted successfully!" });
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
        },
        {
            field: 'update',
            headerName: 'Update',
            headerAlign: 'center',
            flex: 3,
            renderCell: (params) => (
                <Button variant="contained" color="success" onClick={
                    () => {
                        setIngredientUpdating(params.row);
                        setAddingIngredient(true);
                    }
                } > Update</Button >
            )
        },
        {
            field: 'delete',
            headerName: 'Delete',
            headerAlign: 'center',
            flex: 3,
            renderCell: (params) => (
                <Button variant="contained" color="error" onClick={
                    () => setIngredientToDelete(params.row)
                }>Delete</Button>
            )
        }
    ];

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} >
                <Grid size={12}>
                    {ingredientAlert && <Alert severity={ingredientAlert.severity} onClose={() => { setIngredientAlert(null) }}>{ingredientAlert.message}</Alert>}
                </Grid>
                <Grid size={12}>
                    <SearchComponent onSearch={searchIngredients} />
                </Grid>
                <Grid size={12}>
                    <DataGrid
                        autoWidth
                        rows={ingredients}
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
                        pageSizeOptions={[10, 20]}
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
                        marginLeft: 'auto'
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
            <DeletionConfirmationComponent warningMessage={ingredientToDelete ? "Are you sure you want to delete ingredient " + ingredientToDelete.ingredientName + "?" : "Processing"}
                open={ingredientToDelete} onClose={() => setIngredientToDelete(null)}
                onConfirm={() => {
                    deleteIngredient(ingredientToDelete.ingredientId);
                    setIngredientToDelete(null);
                }} />
        </Box>
    )
}

export default IngredientComponent;