import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './kusa-activity.reducer';
import { IKusaActivity } from 'app/shared/model/kusa-activity.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IKusaActivityDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: number }> {}

export class KusaActivityDetail extends React.Component<IKusaActivityDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { kusaActivityEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="jblogApp.kusaActivity.detail.title">KusaActivity</Translate> [<b>{kusaActivityEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="doneAt">
                <Translate contentKey="jblogApp.kusaActivity.doneAt">Done At</Translate>
              </span>
            </dt>
            <dd>
              <TextFormat value={kusaActivityEntity.doneAt} type="date" format={APP_DATE_FORMAT} />
            </dd>
            <dt>
              <span id="count">
                <Translate contentKey="jblogApp.kusaActivity.count">Count</Translate>
              </span>
            </dt>
            <dd>{kusaActivityEntity.count}</dd>
            <dt>
              <Translate contentKey="jblogApp.kusaActivity.kusaGroup">Kusa Group</Translate>
            </dt>
            <dd>{kusaActivityEntity.kusaGroup ? kusaActivityEntity.kusaGroup.id : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/kusa-activity" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>&nbsp;
          <Button tag={Link} to={`/entity/kusa-activity/${kusaActivityEntity.id}/edit`} replace color="primary">
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

const mapStateToProps = ({ kusaActivity }: IRootState) => ({
  kusaActivityEntity: kusaActivity.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KusaActivityDetail);
