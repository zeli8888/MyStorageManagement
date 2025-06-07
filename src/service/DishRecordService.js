import axios from 'axios'

class DishRecordService {
    getAllDishRecords() {
        return axios.get(process.env.REACT_APP_API_URL + '/dishrecords');
    }

    deleteDishRecord(dishRecordId) {
        return axios.delete(process.env.REACT_APP_API_URL + '/dishrecords/' + dishRecordId);
    }

    updateDishRecord(dishRecordId, dishRecordIngredientDTO) {
        return axios.put(process.env.REACT_APP_API_URL + '/dishrecords/' + dishRecordId, dishRecordIngredientDTO);
    }
    addDishRecord(dishRecordIngredientDTO) {
        return axios.post(process.env.REACT_APP_API_URL + '/dishrecords', dishRecordIngredientDTO);
    }

}

export default new DishRecordService()