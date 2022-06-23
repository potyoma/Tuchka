import { Breadcrumb, BreadcrumbItem, Col, Container, Row } from "reactstrap"

const FilePathBreadcrumbs = ({ breadcrumbs, onGoBack, active }) => {
    return (
        <Breadcrumb style={{ '--bs-breadcrumb-divider': '|' }}>
            {breadcrumbs.map(b =>
                <BreadcrumbItem
                    key={`path_${b.id}`}
                    style={b.id !== active.id ? { cursor: "pointer" } : {}}
                    active={b.id === active.id}
                    onClick={() => onGoBack && onGoBack(b.id)}
                    className="text-inline" >
                    <h5 className={b.id === active.id ? "text-dark" : "text-primary"}>{b.name}</h5>
                </BreadcrumbItem>)}
        </Breadcrumb>
    )
}

export default FilePathBreadcrumbs