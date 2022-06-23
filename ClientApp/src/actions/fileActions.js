import { fileConstants } from '../constants/fileConstants';
import {
    getFiles as getFilesService,
    newFolder as newFolderService
} from '../services/filesService';
import { alertActions } from './alertActions';
import config from "../constants/config"
import authHeader from "../helpers/authHeader"
import axios from "axios"

const getFiles = () => {
    const request = () => { return { type: fileConstants.getall_request } }
    const success = (files) => { return { type: fileConstants.getall_success, files } }
    const failure = (error) => { return { type: fileConstants.getall_failure, error } }

    return dispatch => {
        dispatch(request());

        getFilesService()
            .then(
                files => dispatch(success(files)),
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error))
                }
            );
    };
}

const newFolder = (name) => {
    const request = () => { return { type: fileConstants.upload_success } }
    const success = () => { return { type: fileConstants.upload_success } }
    const failure = (error) => { return { type: fileConstants.upload_failure, error } }

    return dispatch => {
        dispatch(request());

        newFolderService()
            .then(
                () => dispatch(success()),
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error))
                }
            );
    };
}

const fileActions = {
    getFiles: getFiles
}

const handleDelete = (id, entityType, callback) => {
    const url = `${config.apiUrl}/files?entity=${entityType}&id=${id}`;

    const conf = {
        headers: {
            'content-type': 'multipart/form-data',
            ...authHeader()
        },
    };

    axios.delete(url, conf)
        .then((response) => {
            callback({ ok: response.status, data: response.data })
        })
        .catch(err => {
            callback({ ok: false, data: err.response.data })
        });
}

export { fileActions, handleDelete }