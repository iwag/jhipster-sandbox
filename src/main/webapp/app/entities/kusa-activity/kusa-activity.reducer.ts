import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IKusaActivity, defaultValue } from 'app/shared/model/kusa-activity.model';

export const ACTION_TYPES = {
  FETCH_KUSAACTIVITY_LIST: 'kusaActivity/FETCH_KUSAACTIVITY_LIST',
  FETCH_KUSAACTIVITY: 'kusaActivity/FETCH_KUSAACTIVITY',
  CREATE_KUSAACTIVITY: 'kusaActivity/CREATE_KUSAACTIVITY',
  UPDATE_KUSAACTIVITY: 'kusaActivity/UPDATE_KUSAACTIVITY',
  DELETE_KUSAACTIVITY: 'kusaActivity/DELETE_KUSAACTIVITY',
  RESET: 'kusaActivity/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IKusaActivity>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type KusaActivityState = Readonly<typeof initialState>;

// Reducer

export default (state: KusaActivityState = initialState, action): KusaActivityState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_KUSAACTIVITY_LIST):
    case REQUEST(ACTION_TYPES.FETCH_KUSAACTIVITY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_KUSAACTIVITY):
    case REQUEST(ACTION_TYPES.UPDATE_KUSAACTIVITY):
    case REQUEST(ACTION_TYPES.DELETE_KUSAACTIVITY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_KUSAACTIVITY_LIST):
    case FAILURE(ACTION_TYPES.FETCH_KUSAACTIVITY):
    case FAILURE(ACTION_TYPES.CREATE_KUSAACTIVITY):
    case FAILURE(ACTION_TYPES.UPDATE_KUSAACTIVITY):
    case FAILURE(ACTION_TYPES.DELETE_KUSAACTIVITY):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_KUSAACTIVITY_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_KUSAACTIVITY):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_KUSAACTIVITY):
    case SUCCESS(ACTION_TYPES.UPDATE_KUSAACTIVITY):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_KUSAACTIVITY):
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

const apiUrl = 'api/kusa-activities';

// Actions

export const getEntities: ICrudGetAllAction<IKusaActivity> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_KUSAACTIVITY_LIST,
  payload: axios.get<IKusaActivity>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IKusaActivity> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_KUSAACTIVITY,
    payload: axios.get<IKusaActivity>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IKusaActivity> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_KUSAACTIVITY,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IKusaActivity> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_KUSAACTIVITY,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IKusaActivity> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_KUSAACTIVITY,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
