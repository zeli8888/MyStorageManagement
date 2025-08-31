import baseApi from './baseApi';

class DishRecordService {
    getAllDishRecords(page, size) {
        return baseApi.get('/dishrecords' + '?page=' + page + '&size=' + size);
    }

    deleteDishRecords(dishRecordIds) {
        return baseApi.delete('/dishrecords', {
            data: dishRecordIds
        });
    }

    updateDishRecord(dishRecordId, dishRecordIngredientDTO) {
        return baseApi.put('/dishrecords/' + dishRecordId, dishRecordIngredientDTO);
    }
    addDishRecord(dishRecordIngredientDTO) {
        return baseApi.post('/dishrecords', dishRecordIngredientDTO);
    }

    searchDishRecords(searchString, page, size) {
        if (searchString === '') {
            return this.getAllDishRecords(page, size);
        }
        return baseApi.get('/dishrecords/search?searchString=' + searchString
            + '&page=' + page + '&size=' + size);
    }

    getDishRecordAnalysis(startTime, endTime) {
        return baseApi.get('/dishrecords/analysis?startTime=' + startTime + '&endTime=' + endTime);
    }

}

export default new DishRecordService()