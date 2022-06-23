import { userConstants } from '../constants/userConstants';

export const users = (state = {}, action) => {
    switch (action.type) {
        case userConstants.getall_request:
            return {
                loading: true
            };
        case userConstants.getall_success:
            return {
                items: action.users
            };
        case userConstants.getall_failure:
            return {
                error: action.error
            };
        default:
            return state
    }
}