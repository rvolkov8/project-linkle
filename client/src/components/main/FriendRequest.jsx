import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';

const FriendRequest = ({
  friendRequestData,
  token,
  handleNewErr,
  updateUserData,
}) => {
  const navigate = useNavigate();

  const formatDate = (isoDate) => {
    const currentDate = new Date();
    const postDate = new Date(isoDate);

    const timeDifferenceInSec = Math.floor((currentDate - postDate) / 1000);

    if (timeDifferenceInSec < 60) {
      return `${timeDifferenceInSec} sec ago`;
    } else if (timeDifferenceInSec < 3600) {
      const minsAgo = Math.floor(timeDifferenceInSec / 60);
      return `${minsAgo} min ago`;
    } else if (timeDifferenceInSec < 86400) {
      const hoursAgo = Math.floor(timeDifferenceInSec / 3600);
      return `${hoursAgo} h ago`;
    } else if (timeDifferenceInSec < 604800) {
      const daysAgo = Math.floor(timeDifferenceInSec / 86400);
      return `${daysAgo} d ago`;
    } else if (timeDifferenceInSec < 2419200) {
      const weeksAgo = Math.floor(timeDifferenceInSec / 604800);
      return `${weeksAgo} w ago`;
    } else if (timeDifferenceInSec < 29030400) {
      const monthsAgo = Math.floor(timeDifferenceInSec / 2419200);
      return `${monthsAgo} m ago`;
    } else {
      const yearsAgo = Math.floor(timeDifferenceInSec / 29030400);
      return yearsAgo === 1 ? `${yearsAgo} year ago` : `${yearsAgo} years ago`;
    }
  };

  const handleConfirmFriendRequest = async (event) => {
    event.stopPropagation();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER}/api/user/me/friend-request/${
          friendRequestData.user._id
        }/confirm`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        const data = await res.json();
        const err = data.msg;
        handleNewErr(err);
      }

      updateUserData();
    } catch (err) {
      handleNewErr(err);
    }
  };

  const handleRemoveFriendRequest = async (event) => {
    event.stopPropagation();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER}/api/user/me/friend-request/${
          friendRequestData.user._id
        }/remove`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        const data = await res.json();
        const err = data.msg;
        handleNewErr(err);
      }

      updateUserData();
    } catch (err) {
      handleNewErr(err);
    }
  };

  const avatarPicture = friendRequestData.user.avatarFileName
    ? `${import.meta.env.VITE_SERVER}/images/avatars/${
        friendRequestData.user.avatarFileName
      }`
    : `${import.meta.env.VITE_SERVER}/images/avatars/avatar.jpg`;

  return (
    <div
      className="friend-request"
      onClick={() => {
        navigate(`/profile/${friendRequestData.user._id}`);
      }}
    >
      <img src={avatarPicture} alt="Avatar" />
      <div>
        <div className="info">
          <h3>{friendRequestData.user.fullName}</h3>
          <p>{formatDate(friendRequestData.createdAt)}</p>
        </div>
        <div className="buttons">
          <button onClick={handleConfirmFriendRequest}>Confirm</button>
          <button onClick={handleRemoveFriendRequest}>Remove</button>
        </div>
      </div>
    </div>
  );
};

FriendRequest.propTypes = {
  friendRequestData: PropTypes.object,
  token: PropTypes.string,
  handleNewErr: PropTypes.func,
  updateUserData: PropTypes.func,
};

export default FriendRequest;
