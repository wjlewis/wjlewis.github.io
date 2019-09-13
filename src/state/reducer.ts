import { Action } from './actions';
import { State, initState } from './State';
import { pendulumReducer } from './Pendulum';
import { controlsReducer } from './Controls';
import { uiReducer } from './UI';
import { simReducer } from './Sim';

const reducer = (state: State=initState, action: Action): State => {
  switch (action.type) {
    default:
      return {
        ...state,
        pendulum: pendulumReducer(state, action),
        controls: controlsReducer(state, action),
        ui: uiReducer(state, action),
        sim: simReducer(state, action),
      };
  }
};

export default reducer;
