import actionTypes from './actionTypes';

export const plateAdd = plate => ({
  type: actionTypes.PLATESTORE_ADD,
  payload: plate,
});

export const plateRemove = plate => ({
  type: actionTypes.PLATESTORE_REMOVE,
  payload: plate,
});
