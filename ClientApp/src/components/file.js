import { handleDelete } from "../actions/fileActions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faFile, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import axios from "axios";
import config from "../constants/config";
import authHeader from "../helpers/authHeader";
import { base64toBlob } from "../helpers/stringHelper";
import { saveAs } from "file-saver";
import { ENTITY_TYPE } from "../constants/fileConstants";

const File = ({ file, onDownloadFail, onDelete, onRename }) => {
    
    const downloadFile = (fileId) => {
        axios.get(`${config.apiUrl}/files/${fileId}`, {
            headers: {
                ...authHeader()
            }
        })
            .then((response) => {
                const blob = base64toBlob(response.data.fileBase64)
                const fileName = response.data.fileData.name
                saveAs(blob, fileName)
            })
            .catch(err => {
                onDownloadFail({ ok: false, data: "Could not locate the requested file..." })
            });
    }

    return (
        <tr>
            <th scope="row">
                <FontAwesomeIcon
                    style={{ cursor: "pointer" }}
                    icon={faFile}
                    onClick={() => downloadFile(file.id)} />
            </th>
            <td>
                {file.name}
            </td>
            <td>
                <FontAwesomeIcon
                    style={{ cursor: "pointer" }}
                    icon={faPencil}
                    onClick={() => onRename(file, ENTITY_TYPE.FILE)} />
            </td>
            <td>
                <FontAwesomeIcon
                    style={{ cursor: "pointer" }}
                    icon={faTrashCan}
                    onClick={() => handleDelete(file.id, ENTITY_TYPE.FILE, onDelete)} />
            </td>
        </tr>
    )
}

export default File