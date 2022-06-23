import React, { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup'
import { Row, Col, Button } from 'reactstrap'
import authHeader from "../helpers/authHeader";
import axios from 'axios'
import config from "../constants/config";
import { Modal, ModalBody, ModalHeader, ModalFooter, Alert } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

const initialValues = {
    name: ""
}

const schema = yup.object().shape({
    name: yup.string().required("A name is required")
        .min(1, "At least one symbol is required")
        .max(255, "The name must not be more than 255 characters")
})

const RenameModal = ({ currentItem, entityType, onAction, isOpen, onToggle }) => {
    const [alert, setAlert] = useState(null)

    const rename = (name) => {
        const requestBody = {
            name: name,
            entityType: entityType,
            itemId: currentItem.id
        }

        const headers = {
            headers: {
                'Content-Type': 'application/json',
                ...authHeader()
            }
        }

        axios.patch(`${config.apiUrl}/files`, requestBody, headers)
            .then(resp => {
                onAction({ ok: true, data: resp.data })
                toggle()
            })
            .catch(err => {
                setAlert("Could not rename...")
            })
    }

    const handleSubmit = (values, { setSubmitting }) => {
        values.name
            && rename(values.name)
        setSubmitting(false)
    }

    const toggle = () => {
        setAlert(null)
        onToggle && onToggle()
    }

    return (
        <Modal
            centered
            toggle={toggle}
            isOpen={isOpen} >
            <ModalHeader
                toggle={toggle}
                close={<Button color="secondary" outline onClick={toggle}><FontAwesomeIcon icon={faCircleXmark} /></Button>}>
                Rename '{currentItem.name}'
            </ModalHeader>
            <ModalBody>

                <Alert
                    className="mt-2"
                    color="danger"
                    isOpen={alert && alert != null}
                    onClick={() => setAlert(null)}>
                    {alert}
                </Alert>

                <Formik
                    initialValues={initialValues}
                    validationSchema={schema}
                    onSubmit={handleSubmit} >

                    {({ isSubmitting }) => (
                        <Form className="mt-4">
                            <Row>
                                <Col>
                                    <Field type="text" name="name" className="form-control width20" placeholder="New name" />
                                    <ErrorMessage className="text-danger" name="name" component="div" />
                                </Col>

                                <Col>
                                    <Button className="mb-2" color='primary' type="submit" disabled={isSubmitting}>
                                        Rename
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    )

                    }
                </Formik>
            </ModalBody>
        </Modal>
    )
}

export default RenameModal