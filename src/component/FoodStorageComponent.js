import FoodProvider from './FoodProvider';
import { Outlet } from 'react-router'

const FoodStorageComponent = function () {

    return (
        <FoodProvider>
            <Outlet />
            {/* <IngredientComponent />
            <DishComponent />
            <DishRecordComponent /> */}
        </FoodProvider>
    )
}

export default FoodStorageComponent;