import React, {ComponentType, FC, useContext} from 'react';
import useStyle from './useStyle';
import withTheme from '../../contexts/theme/withTheme';
import ThemeContext from '../../contexts/theme';

const styled = (Component: ComponentType) => inputStyle => props => {
  let theme = useContext(ThemeContext);
  let style = useStyle(
    typeof inputStyle === 'function' ? inputStyle({...props, theme: theme.theme}) : inputStyle,
  );
  return <Component {...props} style={style} />;
};

export default styled;
