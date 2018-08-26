import {
  applyMiddleware,
  createStore,
} from 'redux';

import rootReducer from './reducers';
import socketMiddleware from './middleware/socketMiddleware';

const middleware = [socketMiddleware];

const store = createStore(rootReducer, applyMiddleware(...middleware));

export default store;