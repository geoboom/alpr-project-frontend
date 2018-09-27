import actionTypes from './actionTypes';

export const plateAdd = payload => ({
  type: actionTypes.PLATESTORE_ADD,
  payload,
});

export const plateRemove = payload => ({
  type: actionTypes.PLATESTORE_REMOVE,
  payload,
});

export const plateSave = payload => ({
  type: actionTypes.PLATESTORE_SAVE,
  payload,
});
