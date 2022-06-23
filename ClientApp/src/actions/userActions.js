import { userConstants } from '../constants/userConstants';
import {
    login as userLogin, logout as userLogout, getAll as userGetAll,
    register as userRegister
} from '../services/userService';
import { alertActions } from './alertActions';
import { history } from '../helpers/history';

const login = (username, password) => {
    const request = (user) => { return { type: userConstants.login_request, user } }
    const success = (user) => { return { type: userConstants.login_success, user } }
    const failure = (error) => { return { type: userConstants.login_failure, error } }

    return dispatch => {
        dispatch(request({ username }));

        userLogin(username, password)
            .then(
                user => {
                    dispatch(success(user));
                    history.push('/');
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            );
    };
}

const logout = () => {
    userLogout();
    return { type: userConstants.logout };
}

const getAll = () => {
    const request = () => { return { type: userConstants.getall_request } }
    const success = (users) => { return { type: userConstants.getall_success, users } }
    const failure = (error) => { return { type: userConstants.getall_failure, error } }

    return dispatch => {
        dispatch(request());

        userGetAll()
            .then(
                users => dispatch(success(users)),
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error))
                }
            );
    };
}

const register = (userModel) => {
    const request = () => { return { type: userConstants.register_request } }
    const success = (user) => { return { type: userConstants.register_success, user } }
    const failure = (error) => { return { type: userConstants.register_failure, error } }

    return dispatch => {
        dispatch(request());

        userRegister(userModel)
            .then(
                user => {
                    dispatch(success(user));
                    history.push('/');
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error))
                }
            );
    };
}

const userActions = {
    login: login,
    logout: logout,
    getAll: getAll,
    register: register
}

export { userActions }