import config from '../constants/config';
import authHeader from '../helpers/authHeader';
import { handleResponse } from './userService';

const getFiles = (folderId) => {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    const url = `${config.apiUrl}/files` + (folderId ? `?folderId=${folderId}` : ``)

    return fetch(url, requestOptions)
        .then(handleResponse)
}

const newFolder = (name, parentId) => {
    const requestBody = {
        name: name,
        parentId: parentId
    }

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify(requestBody)
    };

    const url = `${config.apiUrl}/files`

    return fetch(url, requestOptions)
        .then(handleResponse)
}

export {
    getFiles,
    newFolder
}