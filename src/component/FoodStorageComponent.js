import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import IngredientService from '../service/IngredientService'

const FoodStorageComponent = function () {
    const navigate = useNavigate();

    const [ingredients, setIngredients] = useState([]);

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
        // let ingredient = {
        //     ingredientId: data.id,
        //     ingredientName: data.ingredientName,
        //     ingredientStorage: data.ingredientStorage,
        //     ingredientCost: data.ingredientCost,
        //     ingredientDesc: data.ingredientDesc
        // };
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
                            // Hide columns status and traderName, the other columns will remain visible
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
        </div>
    )
}

export default FoodStorageComponent;