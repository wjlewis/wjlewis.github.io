import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducer';
import * as M from './middleware';

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(
    M.pause,
    M.start,
  )),
);

export default store;
