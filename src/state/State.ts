import { PendulumState, initPendulumState } from './Pendulum';
import { ControlsState, initControlsState } from './Controls';

export interface State {
  pendulum: PendulumState,
  controls: ControlsState,
}

export const initState: State = {
  pendulum: initPendulumState,
  controls: initControlsState,
};
