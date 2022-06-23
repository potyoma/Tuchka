import { Table } from "reactstrap"
import File from "./file"
import Folder from "./folder"

const FileTreeTable = ({ folders, files, onRename, onDelete, onClickFolder, onDownloadFail }) => {
    return (
        <Table>
            <tbody>
                {folders?.map(f => 
                    <Folder 
                        folder={f} 
                        onDelete={onDelete} 
                        onClick={onClickFolder} 
                        onRename={onRename}
                        key={`folder_${f.id}`} />)}
                {files?.map(f => 
                    <File 
                        file={f} 
                        onDelete={onDelete} 
                        onRename={onRename} 
                        onDownloadFail={onDownloadFail}
                        key={`file_${f.id}`} />)}
            </tbody>
        </Table>
    )
}

export default FileTreeTable