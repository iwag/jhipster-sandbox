import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import AccountUser from './account-user';
import AccountUserDetail from './account-user-detail';
import AccountUserUpdate from './account-user-update';
import AccountUserDeleteDialog from './account-user-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={AccountUserUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={AccountUserUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={AccountUserDetail} />
      <ErrorBoundaryRoute path={match.url} component={AccountUser} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={AccountUserDeleteDialog} />
  </>
);

export default Routes;
