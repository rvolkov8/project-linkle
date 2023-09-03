import PropTypes from 'prop-types';
import { useState } from 'react';

const NewPost = ({ token, userData, updateSingleFeedPost }) => {
  const [postBody, setPostBody] = useState('');
  const [postPicture, setPostPicture] = useState(null);
  const [err, setErr] = useState('');

  const handlePostBodyChange = (event) => {
    setPostBody(event.target.value);
  };

  const handlePictureUpload = (event) => {
    const file = event.target.files[0];
    setPostPicture(file);
  };

  const removePostPicture = () => {
    setPostPicture(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!postBody) {
      return;
    }
    try {
      const formData = new FormData();
      formData.append('body', postBody);
      if (postPicture) {
        formData.append('picture', postPicture);
      }

      const res = await fetch(
        `${import.meta.env.VITE_SERVER}/api/post/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        const err = data.msg;
        return setErr(err);
      }

      const postId = await res.json();
      await updateSingleFeedPost(postId);

      setPostBody('');
      setPostPicture(null);
      setErr('');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="new-post">
      <h2>New post</h2>
      <form>
        {postPicture && (
          <>
            <img src={URL.createObjectURL(postPicture)} alt="Uploaded" />
            <button className="remove-picture" onClick={removePostPicture}>
              &#x2715;
            </button>
          </>
        )}

        <textarea
          maxLength={3000}
          placeholder={`What's on your mind, ${userData.firstName}?`}
          onChange={handlePostBodyChange}
          value={postBody}
        ></textarea>
        <div>
          <label htmlFor="post-picture">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <title>image</title>
              <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" />
            </svg>
          </label>
          <input
            type="file"
            id="post-picture"
            accept="image/jpeg, image/webp"
            onChange={handlePictureUpload}
          />
          <button
            className={`post-button ${postBody ? 'enabled' : 'disabled'}`}
            disabled={postBody ? false : true}
            onClick={handleSubmit}
          >
            Post
          </button>
        </div>
        {err && <h3>{err}</h3>}
      </form>
    </div>
  );
};

NewPost.propTypes = {
  token: PropTypes.string,
  userData: PropTypes.object,
  updateSingleFeedPost: PropTypes.func,
};

export default NewPost;
