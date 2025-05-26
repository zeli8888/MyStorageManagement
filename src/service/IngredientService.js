import axios from 'axios'

class IngredientService {
    getAllIngredients() {
        return axios.get(process.env.REACT_APP_API_URL + '/ingredients');
    }
}

export default new IngredientService()