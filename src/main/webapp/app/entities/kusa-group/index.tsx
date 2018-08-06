import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import KusaGroup from './kusa-group';
import KusaGroupDetail from './kusa-group-detail';
import KusaGroupUpdate from './kusa-group-update';
import KusaGroupDeleteDialog from './kusa-group-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={KusaGroupUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={KusaGroupUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={KusaGroupDetail} />
      <ErrorBoundaryRoute path={match.url} component={KusaGroup} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={KusaGroupDeleteDialog} />
  </>
);

export default Routes;
