import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dishRecordService from '../service/DishRecordService';
import { PieChartCard } from './utils'
import Grid from '@mui/material/Grid';
import { DataGrid } from '@mui/x-data-grid';
const columns = [
    {
        field: 'ingredientId',
        headerName: 'Id',
        width: 0,
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
        field: 'supplyDays',
        headerName: 'Supply Days',
        flex: 2,
        type: 'number',
        editable: false,
        headerAlign: 'center'
    },
    {
        field: 'dailyUsage',
        headerName: 'Daily Usage',
        flex: 2,
        type: 'number',
        editable: false,
        headerAlign: 'center'
    },
    {
        field: 'totalUsage',
        headerName: 'Total Usage',
        flex: 2,
        type: 'number',
        editable: false,
        headerAlign: 'center'
    },
    {
        field: 'totalCost',
        headerName: 'Total Cost',
        flex: 2,
        type: 'number',
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

export default function HomeComponent() {
    const navigate = useNavigate();
    const [foodRecordAnalysis, setFoodRecordAnalysis] = useState();
    const [endTime, setEndTime] = useState(new Date().toISOString());
    const [startTime, setStartTime] = useState(() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date.toISOString();
    });

    const refresh = () => {
        dishRecordService.getDishRecordAnalysis(startTime, endTime).then(response => {
            setFoodRecordAnalysis(response.data);
            console.log(response.data);
        }).catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        refresh();
    }, [navigate]);

    return (
        foodRecordAnalysis && <div>
            <Grid container spacing={2} direction="row" width={'100%'}>
                <Grid size={{ md: 12, lg: 10 }} width={'100%'}>
                    <DataGrid
                        rows={foodRecordAnalysis.ingredientsSummary.map(
                            summary => ({
                                ...summary.ingredient,
                                ...summary,
                            })
                        )}
                        columns={columns}
                        initialState={{
                            sorting: {
                                sortModel: [{
                                    field: 'supplyDays',
                                    sort: 'asc',
                                }]
                            },
                            columns: {
                                columnVisibilityModel: {
                                    ingredientId: false,
                                    ingredientCost: false,
                                    ingredientDesc: false,
                                    ingredientStorage: false,
                                }
                            },
                            pagination: {
                                paginationModel: {
                                    pageSize: 10,
                                }
                            }
                        }}
                        pageSizeOptions={[5, 10, 15, 20, 25]}
                        getRowId={(row) => row.ingredientId}
                        disableRowSelectionOnClick
                        sx={{
                            boxShadow: 2,
                            border: 2,
                            borderColor: 'lightgrey',
                            '& .MuiDataGrid-cell': {
                                textAlign: 'center',
                            }
                        }}
                    />
                </Grid>

                <Grid size={{ md: 12, lg: 2 }} width={'100%'}>
                    <Grid container direction="column" spacing={1}>
                        <Grid sx={{ flex: 1 }}>
                            <PieChartCard
                                data={foodRecordAnalysis.ingredientsSummary.map(
                                    summary => ({
                                        id: summary.ingredient.ingredientId,
                                        label: summary.ingredient.ingredientName,
                                        value: summary.totalCost
                                    }))
                                }
                                title="Ingredients Cost"
                                showLinear={false}
                            />
                        </Grid>

                        <Grid sx={{ flex: 5 }}>
                            <PieChartCard
                                data={foodRecordAnalysis.dishesSummary.map(
                                    summary => ({
                                        id: summary.dish.dishId,
                                        label: summary.dish.dishName,
                                        value: summary.totalUsage
                                    }))
                                }
                                title="Dishes Cooked"
                                showLinear={true}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}