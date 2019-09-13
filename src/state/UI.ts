import { State } from './State';
import { Action } from './actions';
import * as A from './actions';
import Vector from '../tools/Vector';

export interface UIState {
  isMouseDown: boolean;
  mousePos: Vector;
}

export const initUIState: UIState = {
  isMouseDown: false,
  mousePos: new Vector(0, 0),
};

export const isMouseDown = (state: State): boolean => state.ui.isMouseDown;

export const mousePos = (state: State): Vector => state.ui.mousePos;

export const uiReducer = (state: State, action: Action): UIState => {
  switch (action.type) {
    case A.MOUSE_DOWN_FIELD:
      return mouseDownField(state, action.payload.pos);
    case A.MOUSE_MOVE_FIELD:
      return mouseMoveField(state, action.payload.pos);
    case A.MOUSE_UP:
      return mouseUp(state);
    default:
      return state.ui;
  }
};

const mouseDownField = (state: State, pos: Vector): UIState => ({
  ...state.ui,
  isMouseDown: true,
});

const mouseMoveField = (state: State, pos: Vector): UIState => ({
  ...state.ui,
  mousePos: pos,
});

const mouseUp = (state: State): UIState => ({
  ...state.ui,
  isMouseDown: false,
});
