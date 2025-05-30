import React, { Component, useState, useEffect } from 'react';
import IngredientService from '../service/IngredientService'
import DishService from '../service/DishService'

export const FoodContext = React.createContext();  //exporting context object

const FoodProvider = ({ children }) => {
    const [ingredients, setIngredients] = useState([]);
    const [dishes, setDishes] = useState([]);

    useEffect(() => {
        IngredientService.getAllIngredients().then(response => { setIngredients(response.data) })
        DishService.getAllDishes().then(response => { setDishes(response.data) })
    }, []);

    return (
        <FoodContext.Provider value={
            {
                ingredients: ingredients,
                setIngredients: setIngredients,
                dishes: dishes,
                setDishes: setDishes
            }}>
            {children
                //this indicates that all the child tags with MyProvider as Parent can access the global store  
            }
        </FoodContext.Provider>)
}

export default FoodProvider;