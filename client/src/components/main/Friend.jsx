import PropTypes from 'prop-types';
import { useState } from 'react';

const Friend = ({ friendData }) => {
  const [showMessenger, setShowMessenger] = useState(false);

  const avatarPicture = friendData.avatarFileName
    ? `${import.meta.env.VITE_SERVER}/images/avatars/${
        friendData.avatarFileName
      }`
    : `${import.meta.env.VITE_SERVER}/images/avatars/avatar.jpg`;

  const fullName = `${friendData.firstName} ${friendData.lastName}`;

  const isOnline = friendData.isOnline;

  const toggleShowMessenger = () => {
    setShowMessenger(!showMessenger);
  };

  return (
    <div
      className="friend"
      onMouseEnter={toggleShowMessenger}
      onMouseLeave={toggleShowMessenger}
    >
      <img src={avatarPicture} alt="Avatar" />
      <div>
        <h3>{fullName}</h3>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
            className={`${isOnline ? 'online' : 'offline'}`}
          >
            <path d="M480-280q83 0 141.5-58.5T680-480q0-83-58.5-141.5T480-680q-83 0-141.5 58.5T280-480q0 83 58.5 141.5T480-280Zm0 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
          </svg>
          <p className={`${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>
      {showMessenger && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>messenger</title>
          <path d="M12,2C6.36,2 2,6.13 2,11.7C2,14.61 3.19,17.14 5.14,18.87C5.3,19 5.4,19.22 5.41,19.44L5.46,21.22C5.5,21.79 6.07,22.16 6.59,21.93L8.57,21.06C8.74,21 8.93,20.97 9.1,21C10,21.27 11,21.4 12,21.4C17.64,21.4 22,17.27 22,11.7C22,6.13 17.64,2 12,2M18,9.46L15.07,14.13C14.6,14.86 13.6,15.05 12.9,14.5L10.56,12.77C10.35,12.61 10.05,12.61 9.84,12.77L6.68,15.17C6.26,15.5 5.71,15 6,14.54L8.93,9.87C9.4,9.14 10.4,8.95 11.1,9.47L13.44,11.23C13.66,11.39 13.95,11.39 14.16,11.23L17.32,8.83C17.74,8.5 18.29,9 18,9.46Z" />
        </svg>
      )}
    </div>
  );
};

Friend.propTypes = {
  friendData: PropTypes.object,
};

export default Friend;
