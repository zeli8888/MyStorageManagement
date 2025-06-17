import axios from 'axios'

class IngredientService {
    getAllIngredients() {
        return axios.get(process.env.REACT_APP_API_URL + '/ingredients');
    }

    deleteIngredient(ingredientId) {
        return axios.delete(process.env.REACT_APP_API_URL + '/ingredients/' + ingredientId);
    }

    updateIngredient(id, ingredient) {
        return axios.put(process.env.REACT_APP_API_URL + '/ingredients/' + id, ingredient);
    }
    addIngredient(ingredient) {
        return axios.post(process.env.REACT_APP_API_URL + '/ingredients', ingredient);
    }

    searchIngredients(searchString) {
        if (searchString === '') {
            return axios.get(process.env.REACT_APP_API_URL + '/ingredients');
        }
        return axios.get(process.env.REACT_APP_API_URL + '/ingredients/search?searchString=' + searchString);
    }
}

export default new IngredientService()