import React, {FC, useState} from 'react';
import MenuContext from '.';
import Menu from '../../components/Menu/Menu';

export interface ContextValue {
  show: ((anchor: any, items: any) => void) | null;
}

const MenuProvider: FC = ({children}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [items, setItems] = useState([]);
  const [anchor, setAnchor] = useState({x: 0, y: 0});

  const show = (anchor: any, items: any) => {
    setVisible(false);
    setAnchor(anchor);
    setItems(items);
    setVisible(true);
  };

  const value: ContextValue = {show};

  return (
    <MenuContext.Provider value={value}>
      {children}
      <Menu visible={visible} anchor={anchor} onDismiss={() => setVisible(false)}>
        {items}
      </Menu>
    </MenuContext.Provider>
  );
};

export default MenuProvider;
