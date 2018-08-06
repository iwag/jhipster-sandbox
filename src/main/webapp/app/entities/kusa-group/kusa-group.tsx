import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAllAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './kusa-group.reducer';
import { IKusaGroup } from 'app/shared/model/kusa-group.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IKusaGroupProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export class KusaGroup extends React.Component<IKusaGroupProps> {
  componentDidMount() {
    this.props.getEntities();
  }

  render() {
    const { kusaGroupList, match } = this.props;
    return (
      <div>
        <h2 id="kusa-group-heading">
          Kusa Groups
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />&nbsp; Create new Kusa Group
          </Link>
        </h2>
        <div className="table-responsive">
          <Table responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Body</th>
                <th>Started At</th>
                <th>Account User</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {kusaGroupList.map((kusaGroup, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${kusaGroup.id}`} color="link" size="sm">
                      {kusaGroup.id}
                    </Button>
                  </td>
                  <td>{kusaGroup.title}</td>
                  <td>{kusaGroup.body}</td>
                  <td>
                    <TextFormat type="date" value={kusaGroup.startedAt} format={APP_DATE_FORMAT} />
                  </td>
                  <td>
                    {kusaGroup.accountUser ? <Link to={`accountUser/${kusaGroup.accountUser.id}`}>{kusaGroup.accountUser.id}</Link> : ''}
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${kusaGroup.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${kusaGroup.id}/edit`} color="primary" size="sm">
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${kusaGroup.id}/delete`} color="danger" size="sm">
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

const mapStateToProps = ({ kusaGroup }: IRootState) => ({
  kusaGroupList: kusaGroup.entities
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KusaGroup);
