import { combineReducers } from 'redux';
import plateStoreReducer from './plateStoreReducer';
import plateLogReducer from './plateLogReducer';

export default combineReducers({
  plateStore: plateStoreReducer,
  plateLog: plateLogReducer,
});
