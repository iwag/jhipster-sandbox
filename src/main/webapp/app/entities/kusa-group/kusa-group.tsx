import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAllAction } from 'react-jhipster';
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
          <Translate contentKey="blogApp.kusaGroup.home.title">Kusa Groups</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />&nbsp;
            <Translate contentKey="blogApp.kusaGroup.home.createLabel">Create new Kusa Group</Translate>
          </Link>
        </h2>
        <div className="table-responsive">
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="global.field.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="blogApp.kusaGroup.title">Title</Translate>
                </th>
                <th>
                  <Translate contentKey="blogApp.kusaGroup.body">Body</Translate>
                </th>
                <th>
                  <Translate contentKey="blogApp.kusaGroup.user">User</Translate>
                </th>
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
                  <td>{kusaGroup.user ? kusaGroup.user.login : ''}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${kusaGroup.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${kusaGroup.id}/edit`} color="primary" size="sm">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${kusaGroup.id}/delete`} color="danger" size="sm">
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
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
