import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { State } from '../state/State';
import * as A from '../state/actions';
import { KinematicsMode, KinematicsModes, kinematicsMode } from '../state/Controls';
import './Controls.css';

export interface ControlsProps {
  className?: string;
  kinematicsMode: KinematicsMode;
  changeKinematicsMode: (mode: KinematicsMode) => void;
}

class Controls extends React.Component<ControlsProps> {
  render() {
    const { kinematicsMode } = this.props;

    return (
      <div className={classNames('controls', this.props.className)}>
        <span className="controls__option">
          <input id="ik-button"
                 type="radio"
                 name="kinematics"
                 value={KinematicsModes.IK}
                 checked={kinematicsMode === KinematicsModes.IK}
                 onChange={this.handleKinematicsModeChange}/>
          <label htmlFor="ik-button">IK</label>
        </span>

        <span className="controls__option">
          <input id="fk-button"
                 type="radio"
                 name="kinematics"
                 value={KinematicsModes.FK}
                 checked={kinematicsMode === KinematicsModes.FK}
                 onChange={this.handleKinematicsModeChange} />
          <label htmlFor="fk-button">FK</label>
        </span>
      </div>
    );
  }

  private handleKinematicsModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const mode = e.target.value as KinematicsMode;
    this.props.changeKinematicsMode(mode);
  };
}

const mapStateToProps = (state: State) => ({
  kinematicsMode: kinematicsMode(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  changeKinematicsMode: (mode: KinematicsMode) => dispatch(A.changeKinematicsMode(mode)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Controls);
