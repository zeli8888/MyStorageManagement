import baseApi from './BaseApi';

class IngredientService {
    getAllIngredients() {
        return baseApi.get('/ingredients');
    }

    deleteIngredients(ingredientIds) {
        return baseApi.delete('/ingredients', { data: ingredientIds });
    }

    updateIngredient(id, ingredient) {
        return baseApi.put('/ingredients/' + id, ingredient);
    }
    addIngredient(ingredient) {
        return baseApi.post('/ingredients', ingredient);
    }

    searchIngredients(searchString) {
        if (searchString === '') {
            return baseApi.get('/ingredients');
        }
        return baseApi.get('/ingredients/search?searchString=' + searchString);
    }
}

export default new IngredientService()