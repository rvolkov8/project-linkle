import PropTypes from 'prop-types';

const Comment = ({ commentData, userData, formatDate }) => {
  const avatarPicture = commentData.author.avatarFileName
    ? `${import.meta.env.VITE_SERVER}/images/avatars/${
        commentData.author.avatarFileName
      }`
    : `${import.meta.env.VITE_SERVER}/images/avatars/avatar.jpg`;

  const authorFullName = commentData.author.fullName;

  const isFriend = userData.friends.some(
    (friendId) => friendId === commentData.author._id
  );

  const isUser = commentData.author._id === userData._id;

  return (
    <div className="comment">
      <img src={avatarPicture} alt="Avatar" />
      <div>
        <div className="author-info">
          <div>
            <h3>{authorFullName}</h3>
            {!isFriend && !isUser ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <title>circle-small</title>
                  <path d="M12,10A2,2 0 0,0 10,12C10,13.11 10.9,14 12,14C13.11,14 14,13.11 14,12A2,2 0 0,0 12,10Z" />
                </svg>
                <button>Add friend</button>
              </>
            ) : null}
          </div>
          <h4>{formatDate(commentData.createdAt)}</h4>
        </div>
        <p>{commentData.body}</p>
      </div>
    </div>
  );
};

Comment.propTypes = {
  commentData: PropTypes.object,
  userData: PropTypes.object,
  formatDate: PropTypes.func,
};

export default Comment;
