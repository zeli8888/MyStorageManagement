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

    const columns = [
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
            width: 90,
            editable: true,
        },
        {
            field: 'ingredientCost',
            headerName: 'Cost',
            type: 'number',
            width: 90,
            editable: true,
        },
        {
            field: 'ingredientDesc',
            headerName: 'Description',
            width: 110,
            editable: true,
        }
    ];

    // const rows = [
    //     { ingredient: 'Beef', storage: 2, cost: 6, description: '610g/6€' },
    // ];

    return (
        <div className="container">
            <DataGrid
                rows={ingredients}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}
                pageSizeOptions={[10, 20]}
                checkboxSelection
                disableRowSelectionOnClick
                getRowId={(row) => row.ingredientName}
            />
        </div>
    )
}

export default FoodStorageComponent;