import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup'
import { userActions } from '../actions/userActions';
import { connect } from 'react-redux';

const initialValues = {
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    phoneNumber: "",
}

const schema = yup.object().shape({
    username: yup.string().required("Username is required").min(3, "Username is too short"),
    password: yup.string().required("Password is required").min(8, 'Password is too short'),
    confirmPassword: yup.string().required("Confirmation is required").oneOf([yup.ref('password')], "Passwords do not match"),
    email: yup.string().notRequired()
        .when("email", {
            is: (val) => val?.length > 0,
            then: (rule) => rule.matches(
                /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                "It has to be a valid email")
        }),
    phoneNumber: yup.string().notRequired()
        .when("phoneNumber", {
            is: (val) => val?.length > 0,
            then: (rule) => rule.matches(
                /^\+?[1-9][0-9]{7,14}$/,
                'It has to be a valid phone number starting with "+"')
        })
},
    [
        ["phoneNumber", "phoneNumber"],
        ["email", "email"]
    ]
)

const RegisterPage = ({ register }) => {
    const handleSubmit = (values, { setSubmitting }) => {
        register(values)
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
                                        <h3 className="mb-4 pb-2 pb-md-0 mb-md-5">Sign Up</h3>
                                        <Form>
                                            <div className="row form-outline mb-4">
                                                <Field type="text" name="username" className="form-control form-control-lg" placeholder="Username" />
                                                <ErrorMessage className="text-danger" name="username" component="div" />
                                            </div>

                                            <div className="row form-outline mb-4">
                                                <Field type="password" name="password" className="form-control form-control-lg" placeholder="Password" />
                                                <ErrorMessage className="text-danger" name="password" component="div" />
                                            </div>

                                            <div className="row form-outline mb-4">
                                                <Field className="form-control form-control-lg" type="password" name="confirmPassword" placeholder="Confirm password" />
                                                <ErrorMessage className="text-danger" name="confirmPassword" component="div" />
                                            </div>

                                            <div className="row form-outline mb-4">
                                                <Field className="form-control form-control-lg" type="email" name="email" placeholder="EMail" />
                                                <ErrorMessage className="text-danger" name="email" component="div" />
                                            </div>

                                            <div className="row form-outline mb-4">
                                                <Field className="form-control form-control-lg" type="text" name="phoneNumber" placeholder="Your phone number" />
                                                <ErrorMessage className="text-danger" name="phoneNumber" component="div" />
                                            </div>

                                            <div className='mt-4 pt-2'>
                                                <button className='btn btn-primary btn-lg' type="submit" disabled={isSubmitting}>
                                                    Submit
                                                </button>
                                            </div>
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

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
    register: (model) => dispatch(userActions.register(model))
})

const connectedRegisterPage = connect(mapStateToProps, mapDispatchToProps)(RegisterPage)
export { connectedRegisterPage as RegisterPage }