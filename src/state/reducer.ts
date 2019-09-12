import { Action } from './actions';
import { State, initState } from './State';
import { controlsReducer } from './Controls';

const reducer = (state: State=initState, action: Action): State => {
  switch (action.type) {
    default:
      return {
        ...state,
        controls: controlsReducer(state, action),
      };
  }
};

export default reducer;
