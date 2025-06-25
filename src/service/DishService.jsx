import axios from 'axios'

class DishService {
    getAllDishes() {
        return axios.get(import.meta.env.VITE_REACT_APP_API_URL + '/dishes');
    }

    deleteDishes(dishIds) {
        return axios.delete(import.meta.env.VITE_REACT_APP_API_URL + '/dishes', { data: dishIds });
    }

    updateDish(id, dishIngredientDTO) {
        return axios.put(import.meta.env.VITE_REACT_APP_API_URL + '/dishes/' + id, dishIngredientDTO);
    }
    addDish(dishIngredientDTO) {
        return axios.post(import.meta.env.VITE_REACT_APP_API_URL + '/dishes', dishIngredientDTO);
    }

    searchDishes(searchString) {
        if (searchString === '') {
            return axios.get(import.meta.env.VITE_REACT_APP_API_URL + '/dishes');
        }
        return axios.get(import.meta.env.VITE_REACT_APP_API_URL + '/dishes/search?searchString=' + searchString);
    }
}

export default new DishService()