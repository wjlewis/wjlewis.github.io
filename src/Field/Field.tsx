import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as A from '../state/actions';
import Pendulum from '../Pendulum/Pendulum';
import Vector from '../tools/Vector';
import './Field.css';

export interface FieldProps {
  mouseDown: (pos: Vector) => void;
  mouseMove: (pos: Vector) => void;
  mouseUp: () => void;
}

class Field extends React.Component<FieldProps> {
  render() {
    return (
      <svg className="field"
           width="100%" 
           height="100%"
           onMouseDown={this.handleMouseDown}
           onMouseMove={this.handleMouseMove}>
        <Pendulum />
      </svg>
    );
  }

  /*
   * While a drag must begin over a pendulum arm, it may end anywhere on the
   * page. In order to handle drags that end off of the field, we add a mouseUp
   * listener to the document itself.
   */
  componentDidMount() {
    document.addEventListener('mouseup', this.handleMouseUp as any);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.handleMouseUp as any);
  }

  private handleMouseDown = (e: React.MouseEvent) => {
    this.props.mouseDown(this.computeMousePos(e));
  };

  private handleMouseMove = (e: React.MouseEvent) => {
    this.props.mouseMove(this.computeMousePos(e));
  };

  private handleMouseUp = () => {
    this.props.mouseUp();
  };

  /*
   * We are primarily interested in the cursor's position relative to the field
   * itself. This method calculates this desired quantity based on the
   * information included in a mouse event.
   */
  private computeMousePos = (e: React.MouseEvent) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    const { clientX, clientY } = e;
    return Vector.fromCoordinate(clientX - left, clientY - top);
  };
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  mouseDown: (pos: Vector) => dispatch(A.mouseDownField(pos)),
  mouseMove: (pos: Vector) => dispatch(A.mouseMoveField(pos)),
  mouseUp: () => dispatch(A.mouseUp()),
});

export default connect(
  null,
  mapDispatchToProps,
)(Field);
