import React from 'react';
import ThemeContext from '.';
import {Theme} from './types';

export interface ThemeInjectedProps {
  theme: Theme;
  toggleTheme(): void;
}

const withTheme = <BaseProps extends ThemeInjectedProps>(
  WrapperComponent: React.ComponentType<BaseProps>,
) => {
  type HocProps = Omit<BaseProps, keyof ThemeInjectedProps>;
  return class WithTheme extends React.Component<HocProps> {
    render() {
      return (
        <ThemeContext.Consumer>
          {({theme, toggleTheme}) => (
            <WrapperComponent
              {...(this.props as BaseProps)}
              theme={theme}
              toggleTheme={toggleTheme}
            />
          )}
        </ThemeContext.Consumer>
      );
    }
  };
};

export default withTheme;
