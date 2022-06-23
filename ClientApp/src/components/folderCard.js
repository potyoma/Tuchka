import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFolder, faPencil, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { Card, CardBody, CardTitle } from 'reactstrap'

const FolderCard = ({ folder, onClick, onRename, onDelete }) => {
    return (
        folder
            ?
            <Card style={{ width: "18rem" }} onClick={() => onClick && onClick(folder.id)}>
                <CardTitle>
                    <FontAwesomeIcon icon={faFolder} />
                    {folder.name}
                    <FontAwesomeIcon icon={faPencil} onClick={() => onRename && onRename(folder.id)} />
                    <FontAwesomeIcon icon={faTrashCan} onClick={() => onDelete && onDelete(folder.id)} />
                </CardTitle>
                <CardBody>

                </CardBody>
            </Card>
            : null
    )
}

export { FolderCard }