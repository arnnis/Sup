import React from 'react';
import {Progress, ContextValue} from './provider';

const ProgressBarContext = React.createContext({
  show: null,
  hide: null,
  setProgress: null,
} as ContextValue);

export default ProgressBarContext;
