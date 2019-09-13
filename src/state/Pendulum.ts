import { State } from './State';
import { Action } from './actions';
import * as A from './actions';
import { KinematicsModes, kinematicsMode } from './Controls';
import Vector from '../tools/Vector';
import { clamp } from '../tools/utils';

export interface PendulumState {
  anchor: Vector;
  arm1: Vector;
  arm2: Vector;
   // The following properties are all used to manipulate the arms' positions.
   // `overArm` indicates which arm (if any) the cursor has been pressed down
   // over; `offset1` indicates the angular offset between arm1 and the mouse
   // position (when the mouse was pressed); `offset2` indicates this angular
   // offset for arm2; `phantomArm2` is used in IK mode.
  overArm: null | 1 | 2;
  offset1: null | number;
  offset2: null | number;
  phantomArm2: null | Vector;
}

export const initPendulumState: PendulumState = {
  anchor: Vector.fromCoordinate(200, 225),
  arm1: new Vector(85, -Math.PI / 5),
  arm2: new Vector(105, -7 * Math.PI / 8),
  overArm: null,
  offset1: null,
  offset2: null,
  phantomArm2: null,
};

export const pendulumAnchor = (state: State): Vector => state.pendulum.anchor;

export const pendulumArm1 = (state: State): Vector => state.pendulum.arm1;

export const pendulumArm2 = (state: State): Vector => state.pendulum.arm2;

export const overArm = (state: State): null | number => state.pendulum.overArm;

// This computes the anchor for arm2, which we need in several cases.
const anchor2 = (state: State): Vector => state.pendulum.anchor.plus(state.pendulum.arm1);

export const pendulumReducer = (state: State, action: Action): PendulumState => {
  switch (action.type) {
    case A.MOUSE_DOWN_ARM1:
      return mouseDownArm1(state);
    case A.MOUSE_DOWN_ARM2:
      return mouseDownArm2(state);
    case A.MOUSE_DOWN_FIELD:
      return mouseDownField(state, action.payload.pos);
    case A.MOUSE_UP:
      return mouseUp(state);
    case A.MOUSE_MOVE_FIELD:
      return mouseMoveField(state, action.payload.pos);
    default:
      return state.pendulum;
  }
};

const mouseDownArm1 = (state: State): PendulumState => ({
  ...state.pendulum,
  overArm: 1,
});

const mouseDownArm2 = (state: State): PendulumState => ({
  ...state.pendulum,
  overArm: 2,
});

// When the mouse is pressed down over the field, we compute and store any
// information that we might need to update the arms' positions when the mouse
// is moved.
const mouseDownField = (state: State, pos: Vector): PendulumState => ({
  ...state.pendulum,
  offset1: state.pendulum.overArm === 1
    ? state.pendulum.arm1.angleDiff(pos.minus(state.pendulum.anchor))
    : null,
  offset2: state.pendulum.overArm === 1
    ? state.pendulum.arm2.angleDiff(state.pendulum.arm1)
    : state.pendulum.overArm === 2
    ? state.pendulum.arm2.angleDiff(pos.minus(anchor2(state)))
    : null,
  phantomArm2: pos.minus(anchor2(state)),
});

const mouseUp = (state: State): PendulumState => ({
  ...state.pendulum,
  overArm: null,
  offset1: null,
  offset2: null,
});

const mouseMoveField = (state: State, pos: Vector): PendulumState => {
  if (kinematicsMode(state) === KinematicsModes.FK) {
    return updateFK(state, pos);
  } else {
    return updateIK(state, pos);
  }
};

// In Forward Kinematics mode, we simply update the arm position based on the
// offset computed when the mouse was first pressed. Additionally, when arm1 is
// moved, we move arm2 as well, maintaining the angle between the two.
const updateFK = (state: State, pos: Vector): PendulumState => {
  const { pendulum } = state;
  if (pendulum.offset1 !== null && pendulum.offset2 !== null && pendulum.overArm === 1) {
    const relPos1 = pos.minus(pendulum.anchor);
    const angle1 = relPos1.angle + pendulum.offset1;
    const angle2 = angle1 + pendulum.offset2;
    return {
      ...pendulum,
      arm1: pendulum.arm1.setAngle(angle1),
      arm2: pendulum.arm2.setAngle(angle2),
    };
  } else if (pendulum.offset2 !== null && pendulum.overArm === 2) {
    const relPos2 = pos.minus(anchor2(state));
    const angle2 = relPos2.angle + pendulum.offset2;
    return {
      ...pendulum,
      arm2: pendulum.arm2.setAngle(angle2),
    };
  } else {
    return pendulum;
  }
};

// Updating the arm positions in Inverse Kinematics mode is slightly easier when
// arm1 is dragged, and slightly more complicated when arm2 is. In the former
// case, we don't touch arm2's angle, so we only have to update arm1. In the
// latter, things are a bit more involved.
const updateIK = (state: State, pos: Vector): PendulumState => {
  const { pendulum } = state;
  if (pendulum.offset1 !== null && pendulum.overArm === 1) {
    const relPos1 = pos.minus(pendulum.anchor);
    const angle1 = relPos1.angle + pendulum.offset1;
    return {
      ...pendulum,
      arm1: pendulum.arm1.setAngle(angle1),
    };
  } else if (pendulum.offset2 !== null && pendulum.phantomArm2 !== null && pendulum.overArm === 2) {
    const { arm1, arm2, offset2, phantomArm2: ikArm } = pendulum;
    const ikArmTarget = pos;
    const diff = ikArmTarget.minus(pendulum.anchor).clampLen(arm1.len - ikArm.len, arm1.len + ikArm.len);

    const sq = (x: number) => x * x;
    const cosOfArmsAngle = (sq(arm1.len) + sq(ikArm.len) - sq(diff.len)) / (2 * arm1.len * ikArm.len);
    const armsAngle = Math.acos(clamp(-1, 1, cosOfArmsAngle));
    const isConcave = Math.floor((arm2.angleDiff(arm1) + 2 * Math.PI) / Math.PI) % 2 === 0;
    const phi = isConcave ? armsAngle : 2 * Math.PI - armsAngle;

    const gamma = Math.asin(ikArm.len * Math.sin(phi) / diff.len);
    const angle1 = - (gamma - diff.angle);
    const angle2 = Math.PI + angle1 + offset2 - phi;

    return {
      ...state.pendulum,
      arm1: arm1.setAngle(angle1),
      arm2: arm2.setAngle(angle2),
    };
  } else {
    return state.pendulum;
  }
};
