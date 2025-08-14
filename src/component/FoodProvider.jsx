import React, { useState, useEffect } from 'react';
import ingredientService from '../service/IngredientService'
import dishService from '../service/DishService'

export const FoodContext = React.createContext();  //exporting context object

const FoodProvider = ({ children }) => {
    const [allIngredients, setAllIngredients] = useState([]);
    const [allDishes, setAllDishes] = useState([]);

    useEffect(() => {
        ingredientService.getAllIngredients().then(response => { setAllIngredients(response.data) }).catch(error => { console.log(error) });
        dishService.getAllDishes().then(response => { setAllDishes(response.data) }).catch(error => { console.log(error) });
    }, []);

    return (
        <FoodContext.Provider value={
            {
                allIngredients: allIngredients,
                setAllIngredients: setAllIngredients,
                allDishes: allDishes,
                setAllDishes: setAllDishes
            }}>
            {children
                //this indicates that all the child tags with MyProvider as Parent can access the global store  
            }
        </FoodContext.Provider>)
}

export default FoodProvider;