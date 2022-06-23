import { alertConstants } from "../constants/alertConstants";

export const alert = (state = {}, action) => {
    switch (action.type) {
        case alertConstants.success:
            return {
                type: 'alert-success',
                message: action.message
            }
        case alertConstants.error:
            return {
                type: 'alert-danger',
                message: action.message
            }
        case alertConstants.clear:
            return {}
        default:
            return state
    }
}