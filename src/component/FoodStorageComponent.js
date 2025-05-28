import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import IngredientService from '../service/IngredientService'

const FoodStorageComponent = function () {
    const navigate = useNavigate();

    const [ingredients, setIngredients] = useState([]);
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

    const deleteIngredient = (ingredientId) => {
        IngredientService.deleteIngredient(ingredientId).then(response => {
            refreshIngredients();
        }).catch(error => {
            console.log(error);
        });
    }

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
                <button className="btn btn-warning" onClick={() => deleteIngredient(params.row.id)}>Delete</button>
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
                checkboxSelection
                disableRowSelectionOnClick
                getRowId={(row) => row.ingredientId}
            />

            <Button variant="contained" color="success"
                onClick={() => {
                    setAddingIngredient(true);
                }}
            >
                Add
            </Button>
            <Modal
                open={addingIngredient}
                onClose={() => { setAddingIngredient(false) }}
                aria-labelledby="modal-title"
            >
                <div>
                    <Typography id="modal-title" variant="h6" component="h2">
                        New Ingredient
                    </Typography>
                    <Formik
                        onSubmit={updateIngredient}>
                        {
                            (formikProps) => (
                                <>
                                    <Modal.Body>
                                        <Form>
                                            <ErrorMessage name="description" component="div"
                                                className="alert alert-warning" />
                                            <fieldset className="form-group">
                                                <label>Ingredient Name</label>
                                                <Field className="form-control" type="text" name="ingredientName" required />
                                            </fieldset>
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
                                        </Form>
                                    </Modal.Body>

                                    <Modal.Footer>
                                        <Button variant="contained" color="alert" onClick={() => { setAddingIngredient(false) }}>Cancel</Button>
                                        <Button variant="contained" color="success" onClick={formikProps.submitForm}>Save</Button>
                                    </Modal.Footer>
                                </>
                            )
                        }
                    </Formik>
                </div>
            </Modal>
        </div>
    )
}

export default FoodStorageComponent;