import { handleDelete } from "../actions/fileActions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faFolder, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { ENTITY_TYPE } from "../constants/fileConstants";

const Folder = ({ folder, onDelete, onClick, onRename }) => {

    return (
        <tr>
            <th scope="row">
                <FontAwesomeIcon style={{ cursor: "pointer" }} icon={faFolder} onClick={() => onClick && onClick(folder.id)} />
            </th>
            <td>
                {folder.name}
            </td>
            <td>
                <FontAwesomeIcon 
                    style={{ cursor: "pointer" }} 
                    icon={faPencil} 
                    onClick={() => onRename(folder, ENTITY_TYPE.FOLDER)} />
            </td>
            <td>
                <FontAwesomeIcon
                    style={{ cursor: "pointer" }}
                    icon={faTrashCan}
                    onClick={() => handleDelete(folder.id, ENTITY_TYPE.FOLDER, onDelete)} />
            </td>
        </tr>
    )
}

export default Folder