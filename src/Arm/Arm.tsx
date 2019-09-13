import React from 'react';
import classNames from 'classnames';
import Vector from '../tools/Vector';
import './Arm.css';

export interface ArmProps {
  root: Vector;
  arm: Vector;
  isActive: boolean;
  isMoving: boolean;
  onMouseDown: () => void;
}

class Arm extends React.Component<ArmProps> {
  render() {
    const className = classNames('arm', {
      'arm--moving': this.props.isMoving,
      'arm--active': this.props.isActive,
    });
    return (
      <g>
        <path className={className}
              d={this.constructPathString()}
              onMouseDown={this.handleMouseDown} />
        {this.renderFulcrum()}
      </g>
    );
  }

  private handleMouseDown = () => {
    this.props.onMouseDown();
  };

  private constructPathString() {
    const PADDING = 10;
    const { root, arm } = this.props;
    const lengthPadding = arm.normalize().scale(PADDING);
    const rootEdge = root.minus(lengthPadding);
    const tipEdge = root.plus(arm).plus(lengthPadding);
    const widthPadding = lengthPadding.perp();
    const c1 = rootEdge.plus(widthPadding).toCoordinate();
    const c2 = rootEdge.minus(widthPadding).toCoordinate();
    const c3 = tipEdge.minus(widthPadding).toCoordinate();
    const c4 = tipEdge.plus(widthPadding).toCoordinate();
    return `M ${c1.x} ${c1.y} L ${c2.x} ${c2.y} L ${c3.x} ${c3.y} L ${c4.x} ${c4.y} Z`;
  }

  private renderFulcrum() {
    const FULCRUM_RADIUS = 3;
    const center = this.props.root.toCoordinate();
    return <circle className="arm__fulcrum" cx={center.x} cy={center.y} r={FULCRUM_RADIUS} />;
  }
}

export default Arm;
