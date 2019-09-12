import { State } from './State';
import { Action } from './actions';
import * as A from './actions';

export type KinematicsMode = 'FK' | 'IK';

export const KinematicsModes: { [key: string]: KinematicsMode } = {
  FK: 'FK',
  IK: 'IK',
};

export interface ControlsState {
  kinematicsMode: KinematicsMode;
}

export const initControlsState: ControlsState = {
  kinematicsMode: KinematicsModes.IK,
};

export const kinematicsMode = (state: State): KinematicsMode => state.controls.kinematicsMode;

export const controlsReducer = (state: State, action: Action): ControlsState => {
  switch (action.type) {
    case A.CHANGE_KINEMATICS_MODE:
      return changeKinematicsMode(state, action.payload.mode);
    default:
      return state.controls;
  }
};

const changeKinematicsMode = (state: State, mode: KinematicsMode) => ({
  ...state.controls,
  kinematicsMode: mode,
});
