import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { State } from '../state/State';
import * as A from '../state/actions';
import { pendulumAnchor, pendulumArm1, pendulumArm2, overArm } from '../state/Pendulum';
import Arm from '../Arm/Arm';
import Vector from '../tools/Vector';

export interface PendulumProps {
  anchor: Vector;
  arm1: Vector;
  arm2: Vector;
  overArm: null | number;
  mouseDownArm1: () => void;
  mouseDownArm2: () => void;
}

class Pendulum extends React.Component<PendulumProps> {
  render() {
    const { anchor, arm1, arm2, overArm } = this.props;
    return (
      <g className="pendulum">
        <Arm root={anchor}
             arm={arm1}
             isActive={overArm === 1}
             isMoving={overArm !== null}
             onMouseDown={this.handleMouseDown1} />
        <Arm root={anchor.plus(arm1)}
             arm={arm2}
             isActive={overArm === 2}
             isMoving={overArm !== null}
             onMouseDown={this.handleMouseDown2} />
      </g>
    );
  }

  private handleMouseDown1 = () => {
    this.props.mouseDownArm1();
  };

  private handleMouseDown2 = () => {
    this.props.mouseDownArm2();
  };
}

const mapStateToProps = (state: State) => ({
  anchor: pendulumAnchor(state),
  arm1: pendulumArm1(state),
  arm2: pendulumArm2(state),
  overArm: overArm(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  mouseDownArm1: () => dispatch(A.mouseDownArm1()),
  mouseDownArm2: () => dispatch(A.mouseDownArm2()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Pendulum);
