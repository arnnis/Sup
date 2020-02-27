import React, {FC} from 'react';
import {ContextMenuTrigger as _ContextMenuTrigger} from 'react-contextmenu';
import {Platform} from '../utils/platform';

interface TriggerProps {
  id: string;
}

export const ContextMenuTrigger: FC<TriggerProps> = ({children, id}) =>
  Platform.isWeb ? <_ContextMenuTrigger id={id}>{children}</_ContextMenuTrigger> : <>{children}</>;
