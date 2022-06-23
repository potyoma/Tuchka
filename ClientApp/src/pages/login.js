import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup'

import { userActions } from '../actions/userActions';

const initialValues = {
    username: "",
    password: ""
}

const schema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
})

const LoginPage = ({ logout, login }) => {
    useEffect(() => {
        logout()
    }, [])

    const handleSubmit = (values, { setSubmitting }) => {
        login(values.username, values.password)
        setSubmitting(false)
    }

    return (
        <div>
            <Formik
                initialValues={initialValues}
                validationSchema={schema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <div className="container py-5 h-100">
                        <div className="row justify-content-center align-items-center h-100">
                            <div className="col-12 col-lg-9 col-xl-7">
                                <div className="card shadow-2-strong card-registration" style={{ borderRadius: "15px" }}>
                                    <div className="card-body p-4 p-md-5">
                                        <h3 className="mb-4 pb-2 pb-md-0 mb-md-5">Login</h3>
                                        <Form>
                                            <div className="row form-outline mb-4">
                                                <Field type="text" name="username" className="form-control form-control-lg" placeholder="Username" />
                                                <ErrorMessage className="text-danger" name="username" component="div" />
                                            </div>

                                            <div className="row form-outline mb-4">
                                                <Field type="password" name="password" className="form-control form-control-lg" placeholder="Password" />
                                                <ErrorMessage className="text-danger" name="password" component="div" />
                                            </div>

                                            <div className='mt-4 pt-2'>
                                                <button className='btn btn-primary btn-lg' type="submit" disabled={isSubmitting}>
                                                    Login
                                                </button>
                                            </div>

                                            <h3 className='mt-4'>Don't have an account yet?
                                                <Link to="/register">Create one</Link>
                                            </h3>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Formik>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        loggingIn: state.authentication,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        login: (username, password) => dispatch(userActions.login(username, password)),
        logout: () => dispatch(userActions.logout())
    }
}

const connectedLoginPage = connect(mapStateToProps, mapDispatchToProps)(LoginPage);
export { connectedLoginPage as LoginPage }; 