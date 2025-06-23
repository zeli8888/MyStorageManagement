import React, { useState, useEffect } from 'react';
import IngredientService from '../service/IngredientService'
import DishService from '../service/DishService'

export const FoodContext = React.createContext();  //exporting context object

const FoodProvider = ({ children }) => {
    const [allIngredients, setAllIngredients] = useState([]);
    const [allDishes, setAllDishes] = useState([]);

    useEffect(() => {
        IngredientService.getAllIngredients().then(response => { setAllIngredients(response.data) })
        DishService.getAllDishes().then(response => { setAllDishes(response.data) })
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