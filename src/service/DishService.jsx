import baseApi from './BaseApi';

class DishService {
    getAllDishes() {
        return baseApi.get('/dishes');
    }

    deleteDishes(dishIds) {
        return baseApi.delete('/dishes', { data: dishIds });
    }

    updateDish(id, dishIngredientDTO) {
        return baseApi.put('/dishes/' + id, dishIngredientDTO);
    }
    addDish(dishIngredientDTO) {
        return baseApi.post('/dishes', dishIngredientDTO);
    }

    searchDishes(searchString) {
        if (searchString === '') {
            return baseApi.get('/dishes');
        }
        return baseApi.get('/dishes/search?searchString=' + searchString);
    }
}

export default new DishService()