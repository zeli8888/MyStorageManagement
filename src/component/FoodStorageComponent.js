import DishComponent from './DishComponent';
import IngredientComponent from './IngredientComponent'
import FoodProvider from './FoodProvider';
import DishRecordComponent from './DishRecordComponent';

const FoodStorageComponent = function () {

    return (
        <FoodProvider>
            <IngredientComponent />
            <DishComponent />
            <DishRecordComponent />
        </FoodProvider>
    )
}

export default FoodStorageComponent;