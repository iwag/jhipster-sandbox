import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAllAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './kusa-activity.reducer';
import { IKusaActivity } from 'app/shared/model/kusa-activity.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IKusaActivityProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export class KusaActivity extends React.Component<IKusaActivityProps> {
  componentDidMount() {
    this.props.getEntities();
  }

  render() {
    const { kusaActivityList, match } = this.props;
    return (
      <div>
        <h2 id="kusa-activity-heading">
          Kusa Activities
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />&nbsp; Create new Kusa Activity
          </Link>
        </h2>
        <div className="table-responsive">
          <Table responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Done At</th>
                <th>Kusa Group</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {kusaActivityList.map((kusaActivity, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${kusaActivity.id}`} color="link" size="sm">
                      {kusaActivity.id}
                    </Button>
                  </td>
                  <td>
                    <TextFormat type="date" value={kusaActivity.doneAt} format={APP_DATE_FORMAT} />
                  </td>
                  <td>
                    {kusaActivity.kusaGroup ? <Link to={`kusaGroup/${kusaActivity.kusaGroup.id}`}>{kusaActivity.kusaGroup.id}</Link> : ''}
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${kusaActivity.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${kusaActivity.id}/edit`} color="primary" size="sm">
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${kusaActivity.id}/delete`} color="danger" size="sm">
                        <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ kusaActivity }: IRootState) => ({
  kusaActivityList: kusaActivity.entities
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KusaActivity);