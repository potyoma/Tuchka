import { userConstants } from '../constants/userConstants';

let user = JSON.parse(localStorage.getItem('user'));
const initialState = user ? { loggedIn: true, user } : {};

export const authentication = (state = initialState, action) => {
    switch (action.type) {
        case userConstants.login_request:
            return {
                loggingIn: true,
                user: action.user
            };
        case userConstants.login_success:
            return {
                loggedIn: true,
                user: action.user
            };
        case userConstants.login_failure:
            return {};
        case userConstants.logout:
            return {};
        default:
            return state
    }
}