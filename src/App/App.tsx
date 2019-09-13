import React from 'react';
import Field from '../Field/Field';
import Controls from '../Controls/Controls';
import './App.css';

export interface AppProps {}

class App extends React.Component<AppProps> {
  render() {
    return (
      <div className="app">
        <div className="app__instructions">
          <div>&mdash; fig. 1: A double pendulum &mdash;</div>
          <div>(drag to reposition; mouse away to resume)</div>
        </div>
        <Controls className="app-controls" />
        <Field />
      </div>
    )
  }
}

export default App;
