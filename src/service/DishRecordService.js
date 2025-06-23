import axios from 'axios'

class DishRecordService {
    getAllDishRecords(page, size) {
        return axios.get(process.env.REACT_APP_API_URL + '/dishrecords' + (!page ? '' : ('?page=' + page)) + (!size ? '' : ('&size=' + size)));
    }

    deleteDishRecords(dishRecordIds) {
        return axios.delete(process.env.REACT_APP_API_URL + '/dishrecords', {
            data: dishRecordIds
        });
    }

    updateDishRecord(dishRecordId, dishRecordIngredientDTO) {
        return axios.put(process.env.REACT_APP_API_URL + '/dishrecords/' + dishRecordId, dishRecordIngredientDTO);
    }
    addDishRecord(dishRecordIngredientDTO) {
        return axios.post(process.env.REACT_APP_API_URL + '/dishrecords', dishRecordIngredientDTO);
    }

    searchDishRecords(searchString, page, size) {
        if (searchString === '') {
            return this.getAllDishRecords(page, size);
        }
        return axios.get(process.env.REACT_APP_API_URL + '/dishrecords/search?searchString=' + searchString
            + (!page ? '' : ('&page=' + page)) + (!size ? '' : ('&size=' + size)));
    }

}

export default new DishRecordService()