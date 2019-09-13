import { PendulumState, initPendulumState } from './Pendulum';
import { ControlsState, initControlsState } from './Controls';
import { UIState, initUIState } from './UI';
import { SimState, initSimState } from './Sim';

export interface State {
  pendulum: PendulumState;
  controls: ControlsState;
  ui: UIState;
  sim: SimState;
}

export const initState: State = {
  pendulum: initPendulumState,
  controls: initControlsState,
  ui: initUIState,
  sim: initSimState,
};
