import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IAccountUser } from 'app/shared/model/account-user.model';
import { getEntities as getAccountUsers } from 'app/entities/account-user/account-user.reducer';
import { getEntity, updateEntity, createEntity, reset } from './kusa-group.reducer';
import { IKusaGroup } from 'app/shared/model/kusa-group.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { keysToValues } from 'app/shared/util/entity-utils';

export interface IKusaGroupUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: number }> {}

export interface IKusaGroupUpdateState {
  isNew: boolean;
  accountUserId: number;
}

export class KusaGroupUpdate extends React.Component<IKusaGroupUpdateProps, IKusaGroupUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      accountUserId: 0,
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }

    this.props.getAccountUsers();
  }

  saveEntity = (event, errors, values) => {
    values.startedAt = new Date(values.startedAt);

    if (errors.length === 0) {
      const { kusaGroupEntity } = this.props;
      const entity = {
        ...kusaGroupEntity,
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
    this.props.history.push('/entity/kusa-group');
  };

  accountUserUpdate = element => {
    const id = element.target.value.toString();
    if (id === '') {
      this.setState({
        accountUserId: -1
      });
    } else {
      for (const i in this.props.accountUsers) {
        if (id === this.props.accountUsers[i].id.toString()) {
          this.setState({
            accountUserId: this.props.accountUsers[i].id
          });
        }
      }
    }
  };

  render() {
    const { kusaGroupEntity, accountUsers, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="blogApp.kusaGroup.home.createOrEditLabel">Create or edit a KusaGroup</h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : kusaGroupEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="id">ID</Label>
                    <AvInput id="kusa-group-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="titleLabel" for="title">
                    Title
                  </Label>
                  <AvField id="kusa-group-title" type="text" name="title" />
                </AvGroup>
                <AvGroup>
                  <Label id="bodyLabel" for="body">
                    Body
                  </Label>
                  <AvField id="kusa-group-body" type="text" name="body" />
                </AvGroup>
                <AvGroup>
                  <Label id="startedAtLabel" for="startedAt">
                    Started At
                  </Label>
                  <AvInput
                    id="kusa-group-startedAt"
                    type="datetime-local"
                    className="form-control"
                    name="startedAt"
                    value={isNew ? null : convertDateTimeFromServer(this.props.kusaGroupEntity.startedAt)}
                  />
                </AvGroup>
                <AvGroup>
                  <Label for="accountUser.id">Account User</Label>
                  <AvInput
                    id="kusa-group-accountUser"
                    type="select"
                    className="form-control"
                    name="accountUser.id"
                    onChange={this.accountUserUpdate}
                  >
                    <option value="" key="0" />
                    {accountUsers
                      ? accountUsers.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.id}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/kusa-group" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />&nbsp;
                  <span className="d-none d-md-inline">Back</span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />&nbsp; Save
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
  accountUsers: storeState.accountUser.entities,
  kusaGroupEntity: storeState.kusaGroup.entity,
  loading: storeState.kusaGroup.loading,
  updating: storeState.kusaGroup.updating
});

const mapDispatchToProps = {
  getAccountUsers,
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
)(KusaGroupUpdate);
