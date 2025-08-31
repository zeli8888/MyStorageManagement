import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dishRecordService from '../service/DishRecordService';
import { PieChartCard } from './utils'
import Grid from '@mui/material/Grid';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Stack, ButtonGroup } from '@mui/material';
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
        headerName: 'Supply Duration (Days)',
        flex: 2,
        type: 'number',
        editable: false,
        headerAlign: 'center'
    },
    {
        field: 'dailyUsage',
        headerName: 'Daily Consumption',
        flex: 2,
        type: 'number',
        editable: false,
        headerAlign: 'center'
    },
    {
        field: 'totalUsage',
        headerName: 'Total Consumption',
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
    const [endDate, setEndDate] = useState(dayjs());
    const [startDate, setStartDate] = useState(endDate.subtract(1, 'month'));

    const refresh = (startDate, endDate) => {
        dishRecordService.getDishRecordAnalysis(startDate.toISOString(), endDate.toISOString()).then(response => {
            setFoodRecordAnalysis(response.data);
        }).catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        refresh(startDate, endDate);
    }, [navigate]);

    return (
        foodRecordAnalysis && <div>
            <Grid container spacing={2} direction="row" width={'100%'}
                sx={{
                    justifyContent: "center",
                }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box
                        sx={{
                            border: '2px solid',
                            borderColor: 'divider',
                            p: 3,
                            borderRadius: 2,
                            boxShadow: 1,
                            width: '100%',
                        }}
                    >
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
                            Analysis Period
                        </Typography>

                        <Grid container spacing={3} alignItems="center">
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Stack direction="row" spacing={2}>
                                    <DatePicker
                                        label="Start Date"
                                        value={startDate}
                                        onChange={(newValue) => setStartDate(newValue)}
                                        maxDate={endDate ?? undefined}
                                        slotProps={{ textField: { fullWidth: true } }}
                                    />
                                    <DatePicker
                                        label="End Date"
                                        value={endDate}
                                        onChange={(newValue) => setEndDate(newValue)}
                                        minDate={startDate ?? undefined}
                                        slotProps={{ textField: { fullWidth: true } }}
                                    />
                                </Stack>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <Grid container spacing={2} justifyContent="flex-end">
                                    <Grid>
                                        <Button
                                            variant="contained"
                                            onClick={() => refresh(startDate, endDate)}
                                            sx={{ textTransform: 'capitalize' }}
                                        >
                                            Apply Filter
                                        </Button>
                                    </Grid>
                                    <Grid>
                                        <ButtonGroup variant="outlined">
                                            <Button
                                                onClick={() => {
                                                    const oneMonthAgo = dayjs().subtract(1, 'month')
                                                    const now = dayjs()
                                                    setStartDate(oneMonthAgo)
                                                    setEndDate(now)
                                                    refresh(oneMonthAgo, now)
                                                }}
                                                sx={{ textTransform: 'capitalize' }}
                                            >
                                                Last Month
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    const oneWeekAgo = dayjs().subtract(1, 'week')
                                                    const now = dayjs()
                                                    setStartDate(oneWeekAgo)
                                                    setEndDate(now)
                                                    refresh(oneWeekAgo, now)
                                                }}
                                                sx={{ textTransform: 'capitalize' }}
                                            >
                                                Last Week
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    const threeDaysAgo = dayjs().subtract(3, 'day')
                                                    const now = dayjs()
                                                    setStartDate(threeDaysAgo)
                                                    setEndDate(now)
                                                    refresh(threeDaysAgo, now)
                                                }}
                                                sx={{ textTransform: 'capitalize' }}
                                            >
                                                3 Days
                                            </Button>
                                        </ButtonGroup>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </LocalizationProvider>
                <Grid size={{ md: 12, lg: 9 }} width={'100%'}>
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

                <Grid size={{ md: 12, lg: 3 }} width={'100%'}>
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