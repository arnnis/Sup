import React, {useRef, FC} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect, DispatchProp} from 'react-redux';
import Touchable from '../../components/Touchable';
import px from '../../utils/normalizePixel';
import showMenu from '../../utils/showMenu';
import {logoutFromCurrentTeam} from '../../actions/teams/thunks';
import isLandscape from '../../utils/stylesheet/isLandscape';

type Props = DispatchProp<any>;

const PopupMenu: FC<Props> = ({dispatch}) => {
  let menuRef = useRef(null);

  let _openMenu = () => {
    showMenu(
      [
        {
          title: 'Logout',
          onPress: () => dispatch(logoutFromCurrentTeam()),
        },
      ],
      menuRef.current,
    );
  };

  if (isLandscape()) return null;

  return (
    <Touchable onPress={_openMenu} ref={ref => (menuRef.current = ref)}>
      <MaterialCommunityIcons name="dots-vertical" color="#fff" size={px(22)} />
    </Touchable>
  );
};

export default connect()(PopupMenu);
