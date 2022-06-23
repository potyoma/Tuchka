import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { combineReducers } from 'redux'
import { authentication } from "../reducers/authenticationReducer"
import { users } from "../reducers/userReducer"
import { alert } from "../reducers/alertReducer"

const rootReducer = combineReducers({
    authentication,
    users,
    alert
})

export const store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware
    )
)