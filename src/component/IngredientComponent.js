import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// import Modal from '@mui/material/Modal';
// import Typography from '@mui/material/Typography';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
import IngredientService from '../service/IngredientService'
import { FoodContext } from './FoodProvider';


const IngredientComponent = function () {
    const navigate = useNavigate();
    const { ingredients, setIngredients } = React.useContext(FoodContext);

    // const [ingredients, setIngredients] = useState([]);
    const [addingIngredient, setAddingIngredient] = useState(false);

    useEffect(() => {
        refreshIngredients();
    }, [navigate]);

    const refreshIngredients = () => {
        IngredientService.getAllIngredients().then(response => {
            setIngredients(response.data);
        }).catch(error => {
            console.log(error);
        });
    }

    const updateIngredient = (data) => {
        IngredientService.updateIngredient(data.ingredientId, data).then(response => {
            refreshIngredients();
        }).catch(error => {
            console.log(error);
        });
    }

    const addIngredient = (data) => {
        IngredientService.addIngredient(data).then(response => {
            setAddingIngredient(false);
            refreshIngredients();
        }).catch(error => {
            console.log(error);
        });
    }

    const deleteIngredient = (ingredientId) => {
        IngredientService.deleteIngredient(ingredientId).then(response => {
            refreshIngredients();
        }).catch(error => {
            console.log(error);
        });
    }

    // const validateIngredient = (data) => {
    //     let errors = {}
    //     if (!data.ingredientName) {
    //         errors.ingredientName = 'Enter the ingredient name!'
    //     }
    //     return errors
    // }

    const columns = [
        {
            field: 'ingredientId',
            headerName: 'Id',
            width: 10,
            editable: false,
        },
        {
            field: 'ingredientName',
            headerName: 'Ingredient',
            width: 150,
            editable: true,
        },
        {
            field: 'ingredientStorage',
            headerName: 'Storage',
            type: 'number',
            width: 110,
            editable: true,
        },
        {
            field: 'ingredientCost',
            headerName: 'Cost',
            type: 'number',
            width: 110,
            editable: true,
        },
        {
            field: 'ingredientDesc',
            headerName: 'Description',
            width: 110,
            editable: true,
        },
        {
            field: 'update',
            headerName: 'Update',
            headerAlign: 'center',
            width: 200,
            renderCell: (params) => (
                <button className="btn btn-success" onClick={() => updateIngredient(params.row)}>Update</button>
            )
        },
        {
            field: 'delete',
            headerName: 'Delete',
            headerAlign: 'center',
            width: 200,
            renderCell: (params) => (
                <button className="btn btn-warning" onClick={() => deleteIngredient(params.row.ingredientId)}>Delete</button>
            )
        }
    ];

    return (
        <div className="container">
            <DataGrid
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
                // checkboxSelection
                disableRowSelectionOnClick
                getRowId={(row) => row.ingredientId}
            />

            <Button variant="contained" color="success"
                onClick={() => {
                    setAddingIngredient(true);
                }}
            >
                New Ingredient
            </Button>
            <Dialog
                open={addingIngredient}
                onClose={() => { setAddingIngredient(false) }}
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
                <DialogTitle>New Ingredient</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        name="ingredientName"
                        label="Ingredient Name"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        required
                        margin="dense"
                        name="ingredientStorage"
                        value={0}
                        label="Ingredient Storage"
                        type="number"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        name="ingredientCost"
                        label="Ingredient Cost"
                        type="number"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        name="ingredientDesc"
                        label="Ingredient Description"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setAddingIngredient(false) }}>Cancel</Button>
                    <Button type="submit">Save</Button>
                </DialogActions>
            </Dialog>

            {/* <Modal
                open={addingIngredient}
                onClose={() => { setAddingIngredient(false) }}
                aria-labelledby="modal-title"
            >
                <div>
                    <Typography id="modal-title" variant="h6" component="h2">
                        New Ingredient
                    </Typography>
                    <Formik
                        initialValues={{
                            ingredientName: '',
                            ingredientStorage: 0,
                            ingredientCost: 0,
                            ingredientDesc: ''
                        }}
                        onSubmit={addIngredient}
                        validateOnChange={true}
                        validateOnBlur={true}
                        validate={validateIngredient}>
                        {
                            (formikProps) => (
                                <>
                                    <Form>
                                        <fieldset className="form-group">
                                            <label>Ingredient Name</label>
                                            <Field className="form-control" type="text" name="ingredientName" />
                                        </fieldset>
                                        <ErrorMessage name="ingredientName" component="div"
                                            className="alert alert-warning" />
                                        <fieldset className="form-group">
                                            <label>Storage</label>
                                            <Field className="form-control" type="number" name="ingredientStorage" />
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <label>Cost</label>
                                            <Field className="form-control" type="number" name="ingredientCost" />
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <label>Description</label>
                                            <Field className="form-control" type="text" name="ingredientDesc" />
                                        </fieldset>
                                        <Button variant="contained" color="error" onClick={() => { setAddingIngredient(false) }}>Cancel</Button>
                                        <Button variant="contained" color="success" onClick={formikProps.submitForm}>Save</Button>
                                    </Form>
                                </>
                            )
                        }
                    </Formik>
                </div>
            </Modal> */}
        </div>
    )
}

export default IngredientComponent;