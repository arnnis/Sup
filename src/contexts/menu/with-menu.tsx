import React from 'react';
import {ContextValue} from './provider';
import MenuContext from '.';

export interface MenuInjectedProps extends ContextValue {}

const WithMenu = <BaseProps extends MenuInjectedProps>(
  WrapperComponent: React.ComponentType<BaseProps>,
) => {
  type HocProps = Omit<BaseProps, keyof MenuInjectedProps>;
  return class WithMenu extends React.Component<HocProps> {
    render() {
      return (
        <MenuContext.Consumer>
          {value => <WrapperComponent {...(this.props as BaseProps)} {...value} />}
        </MenuContext.Consumer>
      );
    }
  };
};

export default WithMenu;
