import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

const AllComments = ({
  userAvatarUrl,
  handleCommentChange,
  commentText,
  handleCommentUpload,
  postAuthorFirstName,
  postCommentsElements,
  toggleAllCommentsAppearance,
}) => {
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div className="all-comments">
      <div className="container">
        <div className="heading">
          <h2>{`${postAuthorFirstName}'s post`}</h2>
          <button
            className="remove-picture"
            onClick={toggleAllCommentsAppearance}
          >
            &#x2715;
          </button>
        </div>
        <div className="comments">
          {postCommentsElements && postCommentsElements}
        </div>
        <form>
          <img src={userAvatarUrl} alt="Avatar" />
          <input
            ref={inputRef}
            type="text"
            onChange={handleCommentChange}
            value={commentText}
            placeholder="Write a comment..."
          />
          <button onClick={handleCommentUpload}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <title>send-variant</title>
              <path d="M3 20V14L11 12L3 10V4L22 12Z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

AllComments.propTypes = {
  userAvatarUrl: PropTypes.string,
  handleCommentChange: PropTypes.func,
  commentText: PropTypes.string,
  handleCommentUpload: PropTypes.func,
  postAuthorFirstName: PropTypes.string,
  postCommentsElements: PropTypes.array,
  toggleAllCommentsAppearance: PropTypes.func,
};

export default AllComments;
