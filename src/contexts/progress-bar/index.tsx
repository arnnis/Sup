import React from 'react';
import {Progress, ContextValue} from './provider';

const ProgressBarContext = React.createContext({
  show: null,
  hide: null,
  updateProgress: null,
} as ContextValue);

export default ProgressBarContext;
