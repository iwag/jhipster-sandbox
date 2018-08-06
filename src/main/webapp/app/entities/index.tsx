import React from 'react';
import { Switch } from 'react-router-dom';

// tslint:disable-next-line:no-unused-variable
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import AccountUser from './account-user';
import KusaGroup from './kusa-group';
import KusaActivity from './kusa-activity';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}/account-user`} component={AccountUser} />
      <ErrorBoundaryRoute path={`${match.url}/kusa-group`} component={KusaGroup} />
      <ErrorBoundaryRoute path={`${match.url}/kusa-activity`} component={KusaActivity} />
      {/* jhipster-needle-add-route-path - JHipster will routes here */}
    </Switch>
  </div>
);

export default Routes;
