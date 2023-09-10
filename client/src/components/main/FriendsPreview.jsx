import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';

const FriendsPreview = ({ friendsData }) => {
  const navigate = useNavigate();
  const limitedFriendsData = friendsData.slice(0, 9);
  const friendsElements = limitedFriendsData.map((friendData) => {
    const friendAvatar = friendData.avatarFileName
      ? `${import.meta.env.VITE_SERVER}/images/avatars/${
          friendData.avatarFileName
        }`
      : `${import.meta.env.VITE_SERVER}/images/avatars/avatar.jpg`;
    return (
      <div
        key={friendData._id}
        className="friend-preview"
        onClick={() => navigate(`/profile/${friendData._id}`)}
      >
        <img src={friendAvatar} alt="Friend avatar" />
        <h3>{friendData.fullName}</h3>
      </div>
    );
  });

  const friendsQuantityText =
    friendsData.length === 1 ? '1 friend' : `${friendsData.length} friends`;

  return (
    <div className="friends-preview">
      <h2>Friends</h2>
      <div className="content">
        <div>
          <p>{friendsQuantityText}</p>
          <button>See all friends</button>
        </div>
        {friendsElements}
      </div>
    </div>
  );
};

FriendsPreview.propTypes = {
  friendsData: PropTypes.array,
};

export default FriendsPreview;
