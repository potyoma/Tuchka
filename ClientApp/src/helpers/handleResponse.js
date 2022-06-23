import { authenticationService } from '../services/authenticationService'

export const handleResponse = response =>
    response.text().then(t => {
        const data = t && JSON.parse(t)

        if (response.ok) return data

        if ([401, 403].indexOf(response.status) !== -1) {
            authenticationService.logout()
            window.location.reload(true)
        }

        const error = (data && data.message) || response.statusText
        return Promise.reject(error)
    })