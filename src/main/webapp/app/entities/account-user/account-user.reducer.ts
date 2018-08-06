import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IAccountUser, defaultValue } from 'app/shared/model/account-user.model';

export const ACTION_TYPES = {
  FETCH_ACCOUNTUSER_LIST: 'accountUser/FETCH_ACCOUNTUSER_LIST',
  FETCH_ACCOUNTUSER: 'accountUser/FETCH_ACCOUNTUSER',
  CREATE_ACCOUNTUSER: 'accountUser/CREATE_ACCOUNTUSER',
  UPDATE_ACCOUNTUSER: 'accountUser/UPDATE_ACCOUNTUSER',
  DELETE_ACCOUNTUSER: 'accountUser/DELETE_ACCOUNTUSER',
  RESET: 'accountUser/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IAccountUser>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type AccountUserState = Readonly<typeof initialState>;

// Reducer

export default (state: AccountUserState = initialState, action): AccountUserState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_ACCOUNTUSER_LIST):
    case REQUEST(ACTION_TYPES.FETCH_ACCOUNTUSER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_ACCOUNTUSER):
    case REQUEST(ACTION_TYPES.UPDATE_ACCOUNTUSER):
    case REQUEST(ACTION_TYPES.DELETE_ACCOUNTUSER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_ACCOUNTUSER_LIST):
    case FAILURE(ACTION_TYPES.FETCH_ACCOUNTUSER):
    case FAILURE(ACTION_TYPES.CREATE_ACCOUNTUSER):
    case FAILURE(ACTION_TYPES.UPDATE_ACCOUNTUSER):
    case FAILURE(ACTION_TYPES.DELETE_ACCOUNTUSER):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_ACCOUNTUSER_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_ACCOUNTUSER):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_ACCOUNTUSER):
    case SUCCESS(ACTION_TYPES.UPDATE_ACCOUNTUSER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_ACCOUNTUSER):
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

const apiUrl = 'api/account-users';

// Actions

export const getEntities: ICrudGetAllAction<IAccountUser> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_ACCOUNTUSER_LIST,
  payload: axios.get<IAccountUser>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IAccountUser> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_ACCOUNTUSER,
    payload: axios.get<IAccountUser>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IAccountUser> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_ACCOUNTUSER,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IAccountUser> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_ACCOUNTUSER,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IAccountUser> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_ACCOUNTUSER,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
