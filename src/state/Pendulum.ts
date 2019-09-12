import { State } from './State';
import Vector from '../tools/Vector';

export interface PendulumState {
  anchor: Vector;
  arm1: Vector;
  arm2: Vector;
}

export const initPendulumState: PendulumState = {
  anchor: Vector.fromCoordinate(150, 200),
  arm1: new Vector(70, Math.PI / 6),
  arm2: new Vector(90, 7 * Math.PI / 8),
};

export const pendulumAnchor = (state: State): Vector => state.pendulum.anchor;

export const pendulumArm1 = (state: State): Vector => state.pendulum.arm1;

export const pendulumArm2 = (state: State): Vector => state.pendulum.arm2;
