import React, { useEffect } from 'react';
import { Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { history } from './helpers/history';
import { alertActions } from './actions/alertActions';
import PrivateRoute from './components/privateRoute';
import { HomePage } from './pages/home';
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';
import Layout from './components/layout';
import { MyFilesPage } from './pages/myFilesPage';

const App = ({ clear, alert }) => {
  useEffect(() => {
    history.listen((location, action) => {
      clear();
    })
  }, []);

  return (
    <div className="jumbotron">
      <div className="container">
        <div className="col-sm-8 col-sm-offset-2">
          {alert.message &&
            <div className={`alert ${alert.type}`}>{alert.message}</div>
          }
          <Router history={history}>
            <Layout>
              <PrivateRoute exact path="/" component={HomePage} />
              <Route path="/login" component={LoginPage} />
              <Route path="/register" component={RegisterPage} />
              <Route path="/myFiles" component={MyFilesPage} />
            </Layout>
          </Router>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  const { alert } = state;
  return {
    alert
  };
}

const mapDispatchToProps = dispatch => {
  return {
    clear: () => dispatch(alertActions.clear())
  }
}

const connectedApp = connect(mapStateToProps, mapDispatchToProps)(App);
export { connectedApp as App };