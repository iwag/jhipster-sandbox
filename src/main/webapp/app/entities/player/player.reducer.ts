import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IPlayer, defaultValue } from 'app/shared/model/player.model';

export const ACTION_TYPES = {
  FETCH_PLAYER_LIST: 'player/FETCH_PLAYER_LIST',
  FETCH_PLAYER: 'player/FETCH_PLAYER',
  CREATE_PLAYER: 'player/CREATE_PLAYER',
  UPDATE_PLAYER: 'player/UPDATE_PLAYER',
  DELETE_PLAYER: 'player/DELETE_PLAYER',
  RESET: 'player/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IPlayer>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type PlayerState = Readonly<typeof initialState>;

// Reducer

export default (state: PlayerState = initialState, action): PlayerState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PLAYER_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PLAYER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_PLAYER):
    case REQUEST(ACTION_TYPES.UPDATE_PLAYER):
    case REQUEST(ACTION_TYPES.DELETE_PLAYER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_PLAYER_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PLAYER):
    case FAILURE(ACTION_TYPES.CREATE_PLAYER):
    case FAILURE(ACTION_TYPES.UPDATE_PLAYER):
    case FAILURE(ACTION_TYPES.DELETE_PLAYER):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_PLAYER_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_PLAYER):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_PLAYER):
    case SUCCESS(ACTION_TYPES.UPDATE_PLAYER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_PLAYER):
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

const apiUrl = 'api/players';

// Actions

export const getEntities: ICrudGetAllAction<IPlayer> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_PLAYER_LIST,
  payload: axios.get<IPlayer>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IPlayer> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PLAYER,
    payload: axios.get<IPlayer>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IPlayer> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PLAYER,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IPlayer> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PLAYER,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IPlayer> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PLAYER,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
