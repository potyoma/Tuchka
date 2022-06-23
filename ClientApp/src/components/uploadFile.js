import { Form, Button, Row, Col } from "reactstrap"
import { useRef, useState } from "react"
import config from "../constants/config"
import axios from "axios"
import authHeader from "../helpers/authHeader"

const UploadFile = ({ currentFolderId, onAdd }) => {
    const [file, setFile] = useState()

    const hiddenFileInput = useRef(null)

    const handleClick = (event) => {
        hiddenFileInput.current.click();
    };

    const handleChange = (event) => {
        setFile(event.target.files[0])
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const url = `${config.apiUrl}/files/${currentFolderId}`;
        const formData = new FormData();
        formData.append('file', file);

        const conf = {
            headers: {
                'content-type': 'multipart/form-data',
                ...authHeader()
            },
        };

        axios.post(url, formData, conf)
            .then((response) => {
                onAdd({ ok: response.status, data: response.data })
                setFile(null)
            })
            .catch(err => {
                console.log(err)
                onAdd({ ok: false, data: err.response.data })
                setFile(null)
            });
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col>
                    <Button
                        color="primary"
                        outline
                        onClick={handleClick}
                        className="mr-2">
                        Select a file
                    </Button>
                    <input
                        ref={hiddenFileInput}
                        name="file"
                        type="file"
                        onChange={handleChange}
                        style={{ display: "none" }}
                    />
                    {file?.name.slice(0, 12)}{file?.name.length > 12 ? "..." : null}
                </Col>
                <Col>
                    <Button color="primary" type="submit">
                        Upload
                    </Button>
                </Col>
            </Row>
        </Form>
    )
}

export default UploadFile