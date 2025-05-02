import React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import { getJwtToken, getAdminJwtToken } from '@/selectors/authSelectors';
import { store } from '@/App';
import * as routes from './constants/routes';
import Home from '@/components/home/Home';
import Reviews from '@/components/reviews/Reviews';
import Locations from '@/components/locations/Locations';
import Questions from '@/components/questions/Questions';
import Posts from '@/components/posts/Posts';
import Login from '@/components/login/Login';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminPortal from '@/components/admin/AdminPortal';
import ErrorSplashPage from '@/components/errorPage/ErrorSplashPage';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import NotFound from '@/components/NotFound/index';

/**
 * `PrivateRoute` component which renders the given component or redirects based on the `authReducer` state.
 *
 * @param {Object} any - Component, style, and ...rest props
 * @returns {JSX.Element} Returns given `Component` or a `Redirect`
 */
const PrivateRoute = ({ component: Component, style: style, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      const isAuthenticated = getJwtToken(store.getState());
      return isAuthenticated ? (
        <Component style={style} {...props} />
      ) : (
        <Redirect
          to={{
            pathname: routes.HOME,
            state: { from: props.location },
          }}
        />
      );
    }}
  />
);

/**
 * `AdminRoute` component which renders the given component or redirects based on the `adminAuthReducer` state.
 *
 * @param {Object} any - Component, style, and ...rest props
 * @returns {JSX.Element} Returns given `Component` or a `Redirect`
 */
const AdminRoute = ({ component: Component, style: style, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      const isAuthenticated = getAdminJwtToken(store.getState());
      return isAuthenticated ? (
        <Component style={style} {...props} />
      ) : (
        <Redirect
          to={{
            pathname: routes.ADMIN_LOGIN,
            state: { from: props.location },
          }}
        />
      );
    }}
  />
);

/**
 * `PublicRoute` component which renders the given component or redirects based on the `adminAuthReducer` state.
 *
 * @param {Object} any - Component, style, and ...rest props
 * @returns {JSX.Element} Returns given `Component` or a `Redirect`
 */
const PublicRoute = ({ component: Component, style: style, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      const isAuthenticated = getAdminJwtToken(store.getState());
      return isAuthenticated ? (
        <Redirect
          to={{
            pathname: routes.ADMIN_PORTAL,
            state: { from: props.location },
          }}
        />
      ) : (
        <Component style={style} {...props} />
      );
    }}
  />
);

/**
 * `Routes` component for delegating route rendering.
 */
const Routes = () => (
  <Switch>
    {/* Admin Portal Pages */}
    <PublicRoute exact path={routes.ADMIN_LOGIN} component={AdminLogin} />
    <AdminRoute exact path={routes.ADMIN_PORTAL} component={AdminPortal} />

    {/* App Pages */}
    {/* <ScrollToTop> */}
    <Route exact path={routes.HOME} component={Home} />
    <Route exact path={routes.HOME_REVIEWS} component={Home} />
    <Route exact path={routes.HOME_QUESTIONS} component={Home} />
    <Route exact path={routes.HOME_POSTS} component={Home} />
    <Route exact path={routes.ERROR_SPLASH_PAGE} component={ErrorSplashPage} />
    <PrivateRoute exact path={routes.LOGIN} component={Login} />
    <PrivateRoute exact path={routes.LOCATIONS} component={Locations} />
    <PrivateRoute exact path={routes.REVIEWS} component={Reviews} />
    <PrivateRoute exact path={routes.QUESTIONS} component={Questions} />
    <PrivateRoute exact path={routes.POSTS} component={Posts} />
    <Route component={NotFound} />
    {/* </ScrollToTop> */}
  </Switch>
);

export default Routes;
