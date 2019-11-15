import React, {FC} from 'react';
import useStylesheet from './useStylesheet';

export interface StyleSheetInjectedProps {
  dynamicStyles: any;
}

const withStylesheet = inputStylesheet => <BaseProps extends StyleSheetInjectedProps>(
  WrapperComponent: React.ComponentType<BaseProps>,
) => {
  type HocProps = Omit<BaseProps, keyof StyleSheetInjectedProps>;

  const WithStylesheet: FC<HocProps> = props => {
    let stylesheet = useStylesheet(inputStylesheet);
    return <WrapperComponent {...(props as BaseProps)} dynamicStyles={stylesheet} />;
  };

  return WithStylesheet;
};

export default withStylesheet;
