import { Action } from './actions';
import { State, initState } from './State';

const reducer = (state: State=initState, action: Action): State => {
  return state;
};

export default reducer;
