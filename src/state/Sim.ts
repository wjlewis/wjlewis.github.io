import { State } from './State';
import { Action } from './actions';
import * as A from './actions';

export interface SimState {
  animId: null | number;
  timestamp: null | number;
}

export const initSimState: SimState = {
  animId: null,
  timestamp: null,
};

export const simAnimId = (state: State): null | number => state.sim.animId;

export const simTimestamp = (state: State): null | number => state.sim.timestamp;

export const simReducer = (state: State, action: Action): SimState => {
  switch (action.type) {
    case A.UPDATE_ANIM_ID:
      return updateAnimId(state, action.payload.id);
    case A.UPDATE_TIMESTAMP:
      return updateTimestamp(state, action.payload.timestamp);
    case A.PAUSE:
      return pause(state);
    default:
      return state.sim;
  }
};

const updateAnimId = (state: State, id: number): SimState => ({
  ...state.sim,
  animId: id,
});

const updateTimestamp = (state: State, timestamp: number): SimState => ({
  ...state.sim,
  timestamp,
});

const pause = (state: State): SimState => ({
  ...state.sim,
  animId: null,
  timestamp: null,
});
