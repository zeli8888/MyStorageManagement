import axios from 'axios'

class DishService {
    getAllDishes() {
        return axios.get(process.env.REACT_APP_API_URL + '/dishes');
    }

    deleteDishes(dishIds) {
        return axios.delete(process.env.REACT_APP_API_URL + '/dishes', { data: dishIds });
    }

    updateDish(id, dishIngredientDTO) {
        return axios.put(process.env.REACT_APP_API_URL + '/dishes/' + id, dishIngredientDTO);
    }
    addDish(dishIngredientDTO) {
        return axios.post(process.env.REACT_APP_API_URL + '/dishes', dishIngredientDTO);
    }

    searchDishes(searchString) {
        if (searchString === '') {
            return axios.get(process.env.REACT_APP_API_URL + '/dishes');
        }
        return axios.get(process.env.REACT_APP_API_URL + '/dishes/search?searchString=' + searchString);
    }
}

export default new DishService()