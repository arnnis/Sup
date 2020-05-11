import React from 'react';
import UserProfile from '../UserProfile';
import {useSelector} from 'react-redux';
import {meSelector} from '../../slices/teams-slice';

const Settings = () => {
  const me = useSelector(meSelector);
  return <UserProfile userId={me && me.id} isMe />;
};

export default Settings;
