import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as A from '../state/actions';
import Field from '../Field/Field';
import Controls from '../Controls/Controls';
import './App.css';

export interface AppProps {
  start: () => void;
}

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

  componentDidMount() {
    this.props.start();
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  start: () => dispatch(A.start()),
});

export default connect(
  null,
  mapDispatchToProps,
)(App);
