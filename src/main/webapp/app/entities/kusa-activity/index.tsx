import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import KusaActivity from './kusa-activity';
import KusaActivityDetail from './kusa-activity-detail';
import KusaActivityUpdate from './kusa-activity-update';
import KusaActivityDeleteDialog from './kusa-activity-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={KusaActivityUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={KusaActivityUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={KusaActivityDetail} />
      <ErrorBoundaryRoute path={match.url} component={KusaActivity} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={KusaActivityDeleteDialog} />
  </>
);

export default Routes;
