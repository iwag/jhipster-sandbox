import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IKusaGroup } from 'app/shared/model/kusa-group.model';
import { getEntities as getKusaGroups } from 'app/entities/kusa-group/kusa-group.reducer';
import { getEntity, updateEntity, createEntity, reset } from './kusa-activity.reducer';
import { IKusaActivity } from 'app/shared/model/kusa-activity.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { keysToValues } from 'app/shared/util/entity-utils';

export interface IKusaActivityUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: number }> {}

export interface IKusaActivityUpdateState {
  isNew: boolean;
  kusaGroupId: number;
}

export class KusaActivityUpdate extends React.Component<IKusaActivityUpdateProps, IKusaActivityUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      kusaGroupId: 0,
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }

    this.props.getKusaGroups();
  }

  saveEntity = (event, errors, values) => {
    values.doneAt = new Date(values.doneAt);

    if (errors.length === 0) {
      const { kusaActivityEntity } = this.props;
      const entity = {
        ...kusaActivityEntity,
        ...values
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
      this.handleClose();
    }
  };

  handleClose = () => {
    this.props.history.push('/entity/kusa-activity');
  };

  kusaGroupUpdate = element => {
    const id = element.target.value.toString();
    if (id === '') {
      this.setState({
        kusaGroupId: -1
      });
    } else {
      for (const i in this.props.kusaGroups) {
        if (id === this.props.kusaGroups[i].id.toString()) {
          this.setState({
            kusaGroupId: this.props.kusaGroups[i].id
          });
        }
      }
    }
  };

  render() {
    const { kusaActivityEntity, kusaGroups, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="blogApp.kusaActivity.home.createOrEditLabel">
              <Translate contentKey="blogApp.kusaActivity.home.createOrEditLabel">Create or edit a KusaActivity</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : kusaActivityEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="kusa-activity-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="doneAtLabel" for="doneAt">
                    <Translate contentKey="blogApp.kusaActivity.doneAt">Done At</Translate>
                  </Label>
                  <AvInput
                    id="kusa-activity-doneAt"
                    type="datetime-local"
                    className="form-control"
                    name="doneAt"
                    value={isNew ? null : convertDateTimeFromServer(this.props.kusaActivityEntity.doneAt)}
                  />
                </AvGroup>
                <AvGroup>
                  <Label for="kusaGroup.id">
                    <Translate contentKey="blogApp.kusaActivity.kusaGroup">Kusa Group</Translate>
                  </Label>
                  <AvInput
                    id="kusa-activity-kusaGroup"
                    type="select"
                    className="form-control"
                    name="kusaGroup.id"
                    onChange={this.kusaGroupUpdate}
                  >
                    <option value="" key="0" />
                    {kusaGroups
                      ? kusaGroups.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.id}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/kusa-activity" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />&nbsp;
                  <span className="d-none d-md-inline">
                    <Translate contentKey="entity.action.back">Back</Translate>
                  </span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />&nbsp;
                  <Translate contentKey="entity.action.save">Save</Translate>
                </Button>
              </AvForm>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  kusaGroups: storeState.kusaGroup.entities,
  kusaActivityEntity: storeState.kusaActivity.entity,
  loading: storeState.kusaActivity.loading,
  updating: storeState.kusaActivity.updating
});

const mapDispatchToProps = {
  getKusaGroups,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KusaActivityUpdate);
