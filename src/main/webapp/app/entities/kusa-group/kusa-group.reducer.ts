import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IKusaGroup, defaultValue } from 'app/shared/model/kusa-group.model';

export const ACTION_TYPES = {
  FETCH_KUSAGROUP_LIST: 'kusaGroup/FETCH_KUSAGROUP_LIST',
  FETCH_KUSAGROUP: 'kusaGroup/FETCH_KUSAGROUP',
  CREATE_KUSAGROUP: 'kusaGroup/CREATE_KUSAGROUP',
  UPDATE_KUSAGROUP: 'kusaGroup/UPDATE_KUSAGROUP',
  DELETE_KUSAGROUP: 'kusaGroup/DELETE_KUSAGROUP',
  RESET: 'kusaGroup/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IKusaGroup>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type KusaGroupState = Readonly<typeof initialState>;

// Reducer

export default (state: KusaGroupState = initialState, action): KusaGroupState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_KUSAGROUP_LIST):
    case REQUEST(ACTION_TYPES.FETCH_KUSAGROUP):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_KUSAGROUP):
    case REQUEST(ACTION_TYPES.UPDATE_KUSAGROUP):
    case REQUEST(ACTION_TYPES.DELETE_KUSAGROUP):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_KUSAGROUP_LIST):
    case FAILURE(ACTION_TYPES.FETCH_KUSAGROUP):
    case FAILURE(ACTION_TYPES.CREATE_KUSAGROUP):
    case FAILURE(ACTION_TYPES.UPDATE_KUSAGROUP):
    case FAILURE(ACTION_TYPES.DELETE_KUSAGROUP):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_KUSAGROUP_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_KUSAGROUP):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_KUSAGROUP):
    case SUCCESS(ACTION_TYPES.UPDATE_KUSAGROUP):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_KUSAGROUP):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/kusa-groups';

// Actions

export const getEntities: ICrudGetAllAction<IKusaGroup> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_KUSAGROUP_LIST,
  payload: axios.get<IKusaGroup>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IKusaGroup> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_KUSAGROUP,
    payload: axios.get<IKusaGroup>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IKusaGroup> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_KUSAGROUP,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IKusaGroup> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_KUSAGROUP,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IKusaGroup> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_KUSAGROUP,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
