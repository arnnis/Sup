import React from 'react';
import ThemeContext from '.';

export interface StyleSheetInjectedProps {
  stylesheet: any;
}

const withStylesheet = inputStylesheet => <BaseProps extends StyleSheetInjectedProps>(
  WrapperComponent: React.ComponentType<BaseProps>,
) => {
  type HocProps = Omit<BaseProps, keyof StyleSheetInjectedProps>;
  return class WithTheme extends React.Component<HocProps> {
    render() {
      return (
        <ThemeContext.Consumer>
          {({stylesheet}) => (
            <WrapperComponent {...(this.props as BaseProps)} stylesheet={stylesheet} />
          )}
        </ThemeContext.Consumer>
      );
    }
  };
};

export default withStylesheet;
