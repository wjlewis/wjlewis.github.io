import React from 'react';
import Field from '../Field/Field';
import Controls from '../Controls/Controls';
import './App.css';

export interface AppProps {}

class App extends React.Component<AppProps> {
  render() {
    return (
      <div className="app">
        <Field />
        <Controls className="app-controls" />
      </div>
    )
  }
}

export default App;
