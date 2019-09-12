import React from 'react';
import { connect } from 'react-redux';
import { State } from '../state/State';
import { pendulumAnchor, pendulumArm1, pendulumArm2 } from '../state/Pendulum';
import Arm from '../Arm/Arm';
import Vector from '../tools/Vector';

export interface PendulumProps {
  anchor: Vector;
  arm1: Vector;
  arm2: Vector;
}

class Pendulum extends React.Component<PendulumProps> {
  render() {
    const { anchor, arm1, arm2 } = this.props;
    return (
      <g className="pendulum">
        <Arm root={anchor} arm={arm1} />
        <Arm root={anchor.plus(arm1)} arm={arm2} />
      </g>
    );
  }
}

const mapStateToProps = (state: State) => ({
  anchor: pendulumAnchor(state),
  arm1: pendulumArm1(state),
  arm2: pendulumArm2(state),
});

export default connect(
  mapStateToProps,
)(Pendulum);
