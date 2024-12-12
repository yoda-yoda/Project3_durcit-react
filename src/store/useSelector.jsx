import React from 'react';
import { useSelector } from 'react-redux';

const UserProfile = () => {
  const { accessToken, refreshToken } = useSelector((state) => state.auth);

  return (
    <div>
      <h1>User Profile</h1>
      <p>Access Token: {accessToken}</p>
      <p>Refresh Token: {refreshToken}</p>
    </div>
  );
};

export default UserProfile;
