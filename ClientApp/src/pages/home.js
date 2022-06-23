import React from 'react';
import { userActions } from '../actions/userActions';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const HomePage = ({  }) => {
    const user = JSON.parse(localStorage.getItem('user'))
    const message = `Hi${user ? ` ${user.username}` : ``}!`

    return (
        <div className='mt-2'>
            <h1>{message}</h1>
            <h2>Welcome to Tuchka. The one cloud you're gonna struggle with.</h2>
        </div>
    );
}

const mapStateToProps = (state) => {
    const { users, authentication } = state;
    const { user } = authentication;
    return {
        user,
        users
    };
}

const mapDispatchToProps = dispatch => ({
    getAll: () => dispatch(userActions.getAll)
})

const connectedHomePage = connect(mapStateToProps, mapDispatchToProps)(HomePage);
export { connectedHomePage as HomePage };