import { PendulumState, initPendulumState } from './Pendulum';

export interface State {
  pendulum: PendulumState,
}

export const initState: State = {
  pendulum: initPendulumState,
};
