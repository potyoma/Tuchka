import { useEffect, useState } from "react"
import { getFiles } from "../services/filesService"
import { NewFolder } from "../components/newFolder"
import FileTreeTable from "../components/fileTreeTable"
import { Alert, Row } from "reactstrap"
import UploadFile from "../components/uploadFile"
import RenameModal from "../components/renameModal"
import FilePathBreadcrumbs from "../components/filePathBreadcrumbs"

const MyFilesPage = ({ }) => {
    const [storage, setStorage] = useState({})
    const [folder, setFolder] = useState('')
    const [needsUpdate, setNeedsUpdate] = useState(false)
    const [alert, setAlert] = useState(null)
    const [currentItem, setCurrentItem] = useState(null)
    const [isOpenModal, setModalOpen] = useState(false)
    const [breadcrumbs, setBreadcrumbs] = useState([])
    const [active, setActive] = useState({})

    const updateBreadCrumbs = (current) => {
        if (breadcrumbs.some(b => b.id === current.id))
            return;

        setActive(current)
        setBreadcrumbs(breadcrumbs.concat(current))
    }

    useEffect(() => {
        getFiles().then(data => {
            setStorage({ folders: data.folders, files: data.files })
            setFolder(data.currentFolder)
            updateBreadCrumbs(data.currentFolder)
        })
    }, [])

    useEffect(() => {
        if (needsUpdate && folder && folder.id) {
            getFiles(folder.id).then(data => {
                const current = data.currentFolder
                setStorage(data)
                setFolder(current)
                updateBreadCrumbs(current)
                setNeedsUpdate(false)
            })
        }
    }, [folder, needsUpdate])

    const handleClick = (folderId) => {
        getFiles(folderId).then(data => {
            const current = data.currentFolder
            setStorage(data)
            setFolder(current)
            updateBreadCrumbs(current)
            setNeedsUpdate(false)
        })
    }

    const handleRename = (item, entityType) => {
        setCurrentItem({ item, entityType })
        setModalOpen(true)
    }

    const handleUpdate = ({ ok, data }) =>
        ok ? setNeedsUpdate(true) : setAlert(data)

    const handleGoBack = (id) => {
        const current = breadcrumbs.findIndex(b => b.id === id)
        if (active !== current && current >= 0) {
            setBreadcrumbs(breadcrumbs.slice(0, current + 1))
            setActive(breadcrumbs[current])
            handleClick(breadcrumbs[current].id)
        }
    }

    return (
        <div className="container">
            <Alert
                className="mt-2"
                color="danger"
                isOpen={alert && alert != null}
                onClick={() => setAlert(null)}>
                {alert}
            </Alert>
            <NewFolder
                currentFolderId={folder.id}
                onAdd={handleUpdate} />
            <UploadFile
                currentFolderId={folder.id}
                onAdd={handleUpdate}
                className="mb-4" />
            {breadcrumbs && breadcrumbs.length > 0 &&
                <Alert 
                    color="warning"
                    className="my-2 p-4 pb-0">
                    <Row style={{ "backgroundColor": "$blue-100" }}>
                        <FilePathBreadcrumbs
                            breadcrumbs={breadcrumbs}
                            onGoBack={handleGoBack}
                            active={active} />
                    </Row>
                </Alert>}
            {storage.folders && storage.folders.length > 0 &&
                <FileTreeTable
                    
                    folders={storage.folders}
                    files={storage.files}
                    onRename={handleRename}
                    onDelete={handleUpdate}
                    onClickFolder={handleClick}
                    onDownloadFail={handleUpdate} />}
            {currentItem && currentItem.item && currentItem.entityType &&
                <RenameModal
                    currentItem={currentItem.item}
                    entityType={currentItem.entityType}
                    isOpen={isOpenModal}
                    onToggle={() => setModalOpen(!isOpenModal)}
                    onAction={handleUpdate} />
            }
        </div >
    )
}

export { MyFilesPage }