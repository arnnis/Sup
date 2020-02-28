import React from 'react';
import {Progress, ContextValue} from './provider';

const MenuContext = React.createContext({
  show: null,
} as ContextValue);

export default MenuContext;
