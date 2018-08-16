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
    const WEEK_OF_TABLE = 44;
    const DAY_OF_WEEK = 7;

    const tables = [];
    for (let i = 0; i < WEEK_OF_TABLE; i++) {
      tables[i] = Array(DAY_OF_WEEK).fill({});
    }

    const today = new Date();
    today.setDate(today.getDate() + ((6 - today.getDay()) % 7));

    for (let i = WEEK_OF_TABLE - 1; i >= 0; i--) {
      for (let j = DAY_OF_WEEK - 1; j >= 0; j--) {
        today.setDate(today.getDate() - 1);
        const d = today.toISOString().slice(0, 10);
        const c = 0;
        /*
          kusaGroupEntity.actvities &&
          kusaGroupEntity.actvities.find((v, i) => v.doneAt && new Date(v.doneAt.toString()).toISOString().slice(0, 10) == d)
            ? 1
            : 0;*/
        tables[i][j] = {
          count: c,
          date: d
        };
      }
    }

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
            <svg width="1200" height="240">
              {tables.map((row, i) => (
                <g transform={`translate(${i * 13}, 0)`}>
                  {row.map((el, j) => (
                    <rect
                      width="10"
                      height="10"
                      x={i}
                      y={j * 12 + 30}
                      fill={el.count > 0 ? '#c6e48b' : '#ebedf0'}
                      data-count={el.count}
                      data-date={el.date}
                    />
                  ))}
                </g>
              ))}
              <text x="13" y="20">
                Aug
              </text>
              <text x="61" y="20">
                Sep
              </text>
              <text x="109" y="20">
                Oct
              </text>
              <text x="169" y="20">
                Nov
              </text>
              <text x="217" y="20">
                Dec
              </text>
              <text x="277" y="20">
                Jan
              </text>
              <text x="325" y="20">
                Feb
              </text>
              <text x="373" y="20">
                Mar
              </text>
              <text x="421" y="20">
                Apr
              </text>
              <text x="481" y="20">
                May
              </text>
              <text x="529" y="20">
                Jun
              </text>
              <text x="577" y="20">
                Jul
              </text>
            </svg>
            <dt>
              {kusaGroupEntity.actvities
                ? kusaGroupEntity.actvities.map((v, i) => (
                    <tr>
                      <td>{v.id}</td>
                      <td>{v.doneAt}</td>
                    </tr>
                  ))
                : ''}
            </dt>
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
