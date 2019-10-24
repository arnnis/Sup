import React, {ComponentType, FC} from 'react';
import useStyle from './useStyle';

const styled = (Component: ComponentType) => inputStyle => props => {
  let style = useStyle(typeof inputStyle === 'function' ? inputStyle(Component) : inputStyle);
  return <Component {...props} style={style} />;
};

export default styled;
