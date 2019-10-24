import React from 'react';
import useStylesheet from './useStylesheet';

export interface StyleSheetInjectedProps {
  stylesheet: any;
}

const withStylesheet = inputStylesheet => <BaseProps extends StyleSheetInjectedProps>(
  WrapperComponent: React.ComponentType<BaseProps>,
) => {
  type HocProps = Omit<BaseProps, keyof StyleSheetInjectedProps>;
  return class WithTheme extends React.Component<HocProps> {
    render() {
      let stylesheet = useStylesheet(inputStylesheet);
      return <WrapperComponent {...(this.props as BaseProps)} stylesheet={stylesheet} />;
    }
  };
};

export default withStylesheet;
