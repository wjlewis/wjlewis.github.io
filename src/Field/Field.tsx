import React from 'react';
import Pendulum from '../Pendulum/Pendulum';
import './Field.css';

export interface FieldProps {}

class Field extends React.Component<FieldProps> {
  render() {
    return (
      <div className="field">
        <Pendulum />
      </div>
    );
  }
}

export default Field;
