import React from "react"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup'
import { Row, Col, Button } from 'reactstrap'
import authHeader from "../helpers/authHeader";
import axios from 'axios'
import config from "../constants/config";

const initialValues = {
    folderName: ""
}

const schema = yup.object().shape({
    folderName: yup.string().required("A name required")
        .min(1, "At least one symbol is required")
        .max(255, "The name must not be more than 255 characters")
})

const NewFolder = ({ currentFolderId, onAdd }) => {

    const addFile = (name, parentId) => {
        const requestBody = {
            name: name,
            parentId: parentId
        }

        const headers = {
            headers: {
                'Content-Type': 'application/json',
                ...authHeader()
            }
        }

        axios.post(`${config.apiUrl}/files`, requestBody, headers)
            .then(resp => {
                onAdd({ ok: resp.status >= 200, data: resp.data })
            })
            .catch(err => {
                onAdd({ ok: false, data: err.response.data })
            })
    }

    const handleSubmit = (values, { setSubmitting }) => {
        values.folderName
            && addFile(values.folderName, currentFolderId)
        setSubmitting(false)
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <Form className="mt-4">
                    <Row>
                        <Col>
                            <Field type="text" name="folderName" className="form-control width20" placeholder="New folder" />
                            <ErrorMessage className="text-danger" name="folderName" component="div" />
                        </Col>

                        <Col>
                            <Button className="mb-2" color='primary' type="submit" disabled={isSubmitting}>
                                Add
                            </Button>
                        </Col>
                    </Row>
                </Form>
            )
            }
        </Formik >
    )
}

export { NewFolder }