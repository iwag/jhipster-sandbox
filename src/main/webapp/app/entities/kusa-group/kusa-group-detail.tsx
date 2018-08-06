import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAction, TextFormat } from 'react-jhipster';
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
            KusaGroup [<b>{kusaGroupEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="title">Title</span>
            </dt>
            <dd>{kusaGroupEntity.title}</dd>
            <dt>
              <span id="body">Body</span>
            </dt>
            <dd>{kusaGroupEntity.body}</dd>
            <dt>
              <span id="startedAt">Started At</span>
            </dt>
            <dd>
              <TextFormat value={kusaGroupEntity.startedAt} type="date" format={APP_DATE_FORMAT} />
            </dd>
            <dt>Account User</dt>
            <dd>{kusaGroupEntity.accountUser ? kusaGroupEntity.accountUser.id : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/kusa-group" replace color="info">
            <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
          </Button>&nbsp;
          <Button tag={Link} to={`/entity/kusa-group/${kusaGroupEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
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
