import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './kusa-group.reducer';
import { IKusaGroup } from 'app/shared/model/kusa-group.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IKusaGroupDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: number }> {}

export class KusaGroupDetail extends React.Component<IKusaGroupDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { kusaGroupEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="blogApp.kusaGroup.detail.title">KusaGroup</Translate> [<b>{kusaGroupEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="title">
                <Translate contentKey="blogApp.kusaGroup.title">Title</Translate>
              </span>
            </dt>
            <dd>{kusaGroupEntity.title}</dd>
            <dt>
              <span id="body">
                <Translate contentKey="blogApp.kusaGroup.body">Body</Translate>
              </span>
            </dt>
            <dd>{kusaGroupEntity.body}</dd>
            <dt>
              <Translate contentKey="blogApp.kusaGroup.user">User</Translate>
            </dt>
            <dd>{kusaGroupEntity.user ? kusaGroupEntity.user.login : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/kusa-group" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>&nbsp;
          <Button tag={Link} to={`/entity/kusa-group/${kusaGroupEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.edit">Edit</Translate>
            </span>
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ kusaGroup }: IRootState) => ({
  kusaGroupEntity: kusaGroup.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KusaGroupDetail);
