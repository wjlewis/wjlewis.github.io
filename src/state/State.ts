import { PendulumState, initPendulumState } from './Pendulum';
import { ControlsState, initControlsState } from './Controls';
import { UIState, initUIState } from './UI';

export interface State {
  pendulum: PendulumState;
  controls: ControlsState;
  ui: UIState;
}

export const initState: State = {
  pendulum: initPendulumState,
  controls: initControlsState,
  ui: initUIState,
};
