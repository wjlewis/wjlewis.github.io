import { Middleware, MiddlewareAPI, Dispatch } from 'redux';
import { State } from './State';
import * as A from './actions';
import { pendulumArm1, pendulumArm2 } from './Pendulum';
import { simAnimId, simTimestamp } from './Sim';

export const pause: Middleware = api => next => action => {
  if (action.type !== A.PAUSE) return next(action);
  const animId = simAnimId(api.getState());
  window.cancelAnimationFrame(animId as number);
  return next(action);
};

export const start: Middleware = api => next => action => {
  if (action.type !== A.START) return next(action);
  const animId = window.requestAnimationFrame(step(api, next));
  next(A.updateAnimId(animId));
  return next(action);
};

const step = (api: MiddlewareAPI, next: Dispatch) => (timestamp: number)=> {
  const state = api.getState();
  const prevTimestamp = simTimestamp(state);
  const MS_PER_SEC = 1000;

  if (prevTimestamp !== null) {
    const deltaT = (timestamp - prevTimestamp) / MS_PER_SEC;
    executeStep(state, next, deltaT);
  }

  next(A.updateTimestamp(timestamp));
  const animId = window.requestAnimationFrame(step(api, next));
  return next(A.updateAnimId(animId));
};

const executeStep = (state: State, next: Dispatch, deltaT: number) => {
  const arm1 = pendulumArm1(state);
  const arm2 = pendulumArm2(state);
  // Update the arm positions here
  return next(A.updateArmAngles(arm1.angle, arm2.angle));
};
