import { KinematicsMode } from './Controls';

export interface Action {
  type: string;
  payload?: any;
}

export const CHANGE_KINEMATICS_MODE = 'CHANGE_KINEMATICS_MODE';
export const changeKinematicsMode = (mode: KinematicsMode) => ({
  type: CHANGE_KINEMATICS_MODE,
  payload: { mode },
});
