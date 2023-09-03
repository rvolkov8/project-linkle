import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

const SharePost = ({
  userData,
  toggleSharePostAppearance,
  sharedPostPicture,
  sharedPostAuthorAvatarPicture,
  sharedPostAuthorFullName,
  sharedPostCreatedAt,
  sharedPostBody,
  sharedPostId,
  token,
  updateSingleFeedPost,
}) => {
  const inputRef = useRef(null);
  const [postBody, setPostBody] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handlePostBodyChange = (event) => {
    setPostBody(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const reqBody = {
        body: postBody,
        sharedPostId: sharedPostId,
      };
      const res = await fetch(`${import.meta.env.VITE_SERVER}/api/post/share`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody),
      });

      if (!res.ok) {
        const data = await res.json();
        const err = data.msg;
        inputRef.current.focus();
        return setErr(err);
      }

      const postId = await res.json();
      await updateSingleFeedPost(postId);
      await updateSingleFeedPost(sharedPostId);

      setPostBody('');
      setErr('');
      toggleSharePostAppearance();
    } catch (err) {
      setErr(err);
    }
  };

  return (
    <div className="share-post">
      <div className="container">
        <div className="heading">
          <h2>{`Share ${userData.firstName}'s post`}</h2>
          <button
            className="remove-picture"
            onClick={toggleSharePostAppearance}
          >
            &#x2715;
          </button>
        </div>
        <div className="sub-container">
          {err && <p>{err}</p>}
          <form>
            <textarea
              ref={inputRef}
              maxLength={3000}
              placeholder={`What's on your mind, ${userData.firstName}?`}
              onChange={handlePostBodyChange}
              value={postBody}
            ></textarea>
          </form>
          <div className="shared-post">
            {sharedPostPicture && sharedPostPicture}
            <div className="author">
              <img src={sharedPostAuthorAvatarPicture} alt="Profile picture" />
              <div>
                <h2>{sharedPostAuthorFullName}</h2>
                <h3>{sharedPostCreatedAt}</h3>
              </div>
            </div>
            <p>{sharedPostBody}</p>
          </div>
        </div>
        <button onClick={handleSubmit}>Post</button>
      </div>
    </div>
  );
};

SharePost.propTypes = {
  userData: PropTypes.object,
  toggleSharePostAppearance: PropTypes.func,
  sharedPostPicture: PropTypes.object,
  sharedPostAuthorAvatarPicture: PropTypes.string,
  sharedPostAuthorFullName: PropTypes.string,
  sharedPostCreatedAt: PropTypes.string,
  sharedPostBody: PropTypes.string,
  sharedPostId: PropTypes.string,
  token: PropTypes.string,
  updateSingleFeedPost: PropTypes.func,
};

export default SharePost;
