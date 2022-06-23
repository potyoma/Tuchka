import { alertConstants } from '../constants/alertConstants'

const success = message => {
    return { type: alertConstants.success, message }
}

const error = message => {
    return { type: alertConstants.error, message }
}

const clear = () => {
    return { type: alertConstants.clear }
}

const alertActions = {
    success: success,
    error: error,
    clear: clear
}

export { alertActions }