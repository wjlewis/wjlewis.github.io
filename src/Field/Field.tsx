import React from 'react';
import Pendulum from '../Pendulum/Pendulum';
import './Field.css';

export interface FieldProps {}

class Field extends React.Component<FieldProps> {
  render() {
    return (
      <svg className="field" width="100%" height="100%">
        <Pendulum />
      </svg>
    );
  }
}

export default Field;
