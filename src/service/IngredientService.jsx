import axios from 'axios'

class IngredientService {
    getAllIngredients() {
        return axios.get(import.meta.env.VITE_REACT_APP_API_URL + '/ingredients');
    }

    deleteIngredients(ingredientIds) {
        return axios.delete(import.meta.env.VITE_REACT_APP_API_URL + '/ingredients', { data: ingredientIds });
    }

    updateIngredient(id, ingredient) {
        return axios.put(import.meta.env.VITE_REACT_APP_API_URL + '/ingredients/' + id, ingredient);
    }
    addIngredient(ingredient) {
        return axios.post(import.meta.env.VITE_REACT_APP_API_URL + '/ingredients', ingredient);
    }

    searchIngredients(searchString) {
        if (searchString === '') {
            return axios.get(import.meta.env.VITE_REACT_APP_API_URL + '/ingredients');
        }
        return axios.get(import.meta.env.VITE_REACT_APP_API_URL + '/ingredients/search?searchString=' + searchString);
    }
}

export default new IngredientService()