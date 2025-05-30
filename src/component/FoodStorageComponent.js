import DishComponent from './DishComponent';
import IngredientComponent from './IngredientComponent'
import FoodProvider from './FoodProvider';

const FoodStorageComponent = function () {

    return (
        <FoodProvider>
            <IngredientComponent />
            <DishComponent />
        </FoodProvider>
    )
}

export default FoodStorageComponent;