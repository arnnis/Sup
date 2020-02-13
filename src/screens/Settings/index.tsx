import React from 'react';
import UserProfile from '../UserProfile';
import {useSelector} from 'react-redux';
import {meSelector} from '../../reducers/teams';

const Settings = () => {
  const me = useSelector(meSelector);
  return <UserProfile userId={me && me.id} isMe />;
};

export default Settings;
