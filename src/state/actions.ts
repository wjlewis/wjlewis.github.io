import { KinematicsMode } from './Controls';
import Vector from '../tools/Vector';

export interface Action {
  type: string;
  payload?: any;
}

// Pendulum actions:
export const MOUSE_DOWN_ARM1 = 'MOUSE_DOWN_ARM1';
export const mouseDownArm1 = (): Action => ({
  type: MOUSE_DOWN_ARM1,
});

export const MOUSE_DOWN_ARM2 = 'MOUSE_DOWN_ARM2';
export const mouseDownArm2 = (): Action => ({
  type: MOUSE_DOWN_ARM2,
});

// Controls actions:
export const CHANGE_KINEMATICS_MODE = 'CHANGE_KINEMATICS_MODE';
export const changeKinematicsMode = (mode: KinematicsMode): Action => ({
  type: CHANGE_KINEMATICS_MODE,
  payload: { mode },
});

// UI actions:
export const MOUSE_DOWN_FIELD = 'MOUSE_DOWN_FIELD';
export const mouseDownField = (pos: Vector): Action => ({
  type: MOUSE_DOWN_FIELD,
  payload: { pos },
});

export const MOUSE_MOVE_FIELD = 'MOUSE_MOVE_FIELD';
export const mouseMoveField = (pos: Vector): Action => ({
  type: MOUSE_MOVE_FIELD,
  payload: { pos },
});

export const MOUSE_UP = 'MOUSE_UP';
export const mouseUp = (): Action => ({
  type: MOUSE_UP,
});
