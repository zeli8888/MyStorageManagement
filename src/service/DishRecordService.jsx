import axios from 'axios'

class DishRecordService {
    getAllDishRecords(page, size) {
        return axios.get(import.meta.env.VITE_REACT_APP_API_URL + '/dishrecords' + '?page=' + page + '&size=' + size);
    }

    deleteDishRecords(dishRecordIds) {
        return axios.delete(import.meta.env.VITE_REACT_APP_API_URL + '/dishrecords', {
            data: dishRecordIds
        });
    }

    updateDishRecord(dishRecordId, dishRecordIngredientDTO) {
        return axios.put(import.meta.env.VITE_REACT_APP_API_URL + '/dishrecords/' + dishRecordId, dishRecordIngredientDTO);
    }
    addDishRecord(dishRecordIngredientDTO) {
        return axios.post(import.meta.env.VITE_REACT_APP_API_URL + '/dishrecords', dishRecordIngredientDTO);
    }

    searchDishRecords(searchString, page, size) {
        if (searchString === '') {
            return this.getAllDishRecords(page, size);
        }
        return axios.get(import.meta.env.VITE_REACT_APP_API_URL + '/dishrecords/search?searchString=' + searchString
            + '&page=' + page + '&size=' + size);
    }

}

export default new DishRecordService()