import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import Comment from './Comment';
import AllComments from './AllComments';
import SharePost from './SharePost';

const Post = ({
  token,
  userData,
  postData,
  updateSingleFeedPost,
  handleNewErr,
}) => {
  const [commentText, setCommentText] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const inputRef = useRef(null);
  const [showAllLikes, setShowAllLikes] = useState(false);
  const [showSharePost, setShowSharePost] = useState(false);
  const [showAllShares, setShowAllShares] = useState(false);

  const authorAvatarPicture = postData.author.avatarFileName
    ? `${import.meta.env.VITE_SERVER}/images/avatars/${
        postData.author.avatarFileName
      }`
    : `${import.meta.env.VITE_SERVER}/images/avatars/avatar.jpg`;

  const authorFullName = postData.author.fullName;

  const postPicture = postData.picture ? (
    <img
      src={`${import.meta.env.VITE_SERVER}/images/posts/${postData.picture}`}
      alt="Post picture"
    />
  ) : null;

  // Shared post
  const sharedPostData = postData.sharesPost && postData.sharesPost;
  const sharedPostPicture =
    sharedPostData && sharedPostData.picture
      ? `${import.meta.env.VITE_SERVER}/images/posts/${sharedPostData.picture}`
      : null;
  const sharedPostAuthorAvatarPicture =
    sharedPostData && sharedPostData.author.avatarFileName
      ? `${import.meta.env.VITE_SERVER}/images/avatars/${
          sharedPostData.author.avatarFileName
        }`
      : `${import.meta.env.VITE_SERVER}/images/avatars/avatar.jpg`;

  const userAvatarPicture = userData.avatarFileName
    ? `${import.meta.env.VITE_SERVER}/images/avatars/${userData.avatarFileName}`
    : `${import.meta.env.VITE_SERVER}/images/avatars/avatar.jpg`;

  const postLikedBy = postData.likedBy;
  const postComments = postData.comments;
  const postSharedBy = postData.sharedBy;
  const uniqueNamesFromPostSharedBy = [
    ...new Set(postSharedBy.map((user) => user.fullName)),
  ];

  const formatDate = (isoDate) => {
    const currentDate = new Date();
    const postDate = new Date(isoDate);

    const timeDifferenceInSec = Math.floor((currentDate - postDate) / 1000);

    if (timeDifferenceInSec < 60) {
      return `${timeDifferenceInSec} seconds ago`;
    } else if (timeDifferenceInSec < 3600) {
      const minsAgo = Math.floor(timeDifferenceInSec / 60);
      return minsAgo === 1 ? `${minsAgo} minute ago` : `${minsAgo} minutes ago`;
    } else if (timeDifferenceInSec < 86400) {
      const hoursAgo = Math.floor(timeDifferenceInSec / 3600);
      return hoursAgo === 1 ? `${hoursAgo} hour ago` : `${hoursAgo} hours ago`;
    } else if (timeDifferenceInSec < 604800) {
      const daysAgo = Math.floor(timeDifferenceInSec / 86400);
      return daysAgo === 1 ? `${daysAgo} day ago` : `${daysAgo} days ago`;
    } else if (timeDifferenceInSec < 2419200) {
      const weeksAgo = Math.floor(timeDifferenceInSec / 604800);
      return weeksAgo === 1 ? `${weeksAgo} week ago` : `${weeksAgo} weeks ago`;
    } else if (timeDifferenceInSec < 29030400) {
      const monthsAgo = Math.floor(timeDifferenceInSec / 2419200);
      return monthsAgo === 1
        ? `${monthsAgo} month ago`
        : `${monthsAgo} months ago`;
    } else {
      const yearsAgo = Math.floor(timeDifferenceInSec / 29030400);
      return yearsAgo === 1 ? `${yearsAgo} year ago` : `${yearsAgo} years ago`;
    }
  };

  const postCommentsElements = postData.comments
    .filter((comment) => comment.author != null)
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((comment) => {
      return (
        <Comment
          key={comment._id}
          commentData={comment}
          userData={userData}
          formatDate={formatDate}
        />
      );
    });

  const likesNamesElements = postLikedBy.map((user) => (
    <p key={user._id}>{user.fullName}</p>
  ));

  const sharedByUniqueNamesElements = uniqueNamesFromPostSharedBy.map(
    (userName) => <p key={userName}>{userName}</p>
  );

  const formatLikesText = () => {
    if (postLikedBy.length === 1) {
      return postLikedBy[0].fullName;
    }
    if (postLikedBy.length > 1) {
      return `${postLikedBy[0].fullName}, and ${postLikedBy.length - 1} others`;
    }
    return null;
  };

  const handleLikePress = async () => {
    try {
      const includesCurrentUser = postLikedBy.find(
        (like) => like._id === userData._id
      );

      if (includesCurrentUser) {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER}/api/post/${postData._id}/unlike`,
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
          return handleNewErr(err);
        }
      } else {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER}/api/post/${postData._id}/like`,
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
          return handleNewErr(err);
        }
      }
      updateSingleFeedPost(postData._id);
    } catch (err) {
      handleNewErr(err);
    }
  };

  const handleCommentPress = async () => {
    if (postCommentsElements.length === 0) {
      return inputRef.current.focus();
    }
    setShowAllComments(true);
  };

  const handleCommentChange = async (event) => {
    setCommentText(event.target.value);
  };

  const handleCommentUpload = async (event) => {
    event.preventDefault();
    try {
      const body = {
        body: commentText,
        postId: postData._id,
      };

      const res = await fetch(
        `${import.meta.env.VITE_SERVER}/api/comment/upload`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) {
        const data = await res.json();
        const err = data.msg;
        return handleNewErr(err);
      }
      setCommentText('');
      await updateSingleFeedPost(postData._id);
      if (postComments.length > 1) {
        setShowAllComments(true);
      }
    } catch (err) {
      handleNewErr(err);
    }
  };

  const toggleAllCommentsAppearance = () => {
    setShowAllComments(!showAllComments);
  };

  const toggleAllLikesAppearance = () => {
    setShowAllLikes(!showAllLikes);
  };

  const toggleSharePostAppearance = () => {
    setShowSharePost(!showSharePost);
  };

  const toggleAllSharesAppearance = () => {
    setShowAllShares(!showAllShares);
  };

  return (
    <div className="post">
      {showAllComments && (
        <AllComments
          userAvatarPicture={userAvatarPicture}
          handleCommentChange={handleCommentChange}
          commentText={commentText}
          handleCommentUpload={handleCommentUpload}
          postAuthorFirstName={postData.author.firstName}
          postCommentsElements={postCommentsElements}
          toggleAllCommentsAppearance={toggleAllCommentsAppearance}
          updateSingleFeedPost={updateSingleFeedPost}
        />
      )}
      {showSharePost && (
        <SharePost
          userData={userData}
          toggleSharePostAppearance={toggleSharePostAppearance}
          sharedPostPicture={postPicture}
          sharedPostAuthorAvatarPicture={authorAvatarPicture}
          sharedPostAuthorFullName={authorFullName}
          sharedPostCreatedAt={formatDate(postData.createdAt)}
          sharedPostBody={postData.body}
          sharedPostId={postData._id}
          token={token}
          updateSingleFeedPost={updateSingleFeedPost}
        />
      )}
      <div className="user">
        <img src={authorAvatarPicture} alt="Profile picture" />
        <div>
          <h2>{authorFullName}</h2>
          <h3>{formatDate(postData.createdAt)}</h3>
        </div>
      </div>
      <p>{postData.body && postData.body}</p>
      {sharedPostData && (
        <div className="shared-post">
          {sharedPostPicture && (
            <img src={sharedPostPicture} alt="Post picture" />
          )}
          <div className="author">
            <img src={sharedPostAuthorAvatarPicture} alt="Profile picture" />
            <div>
              <h2>{sharedPostData.author.fullName}</h2>
              <h3>{formatDate(sharedPostData.createdAt)}</h3>
            </div>
          </div>
          <p>{sharedPostData.body}</p>
        </div>
      )}
      {postPicture && postPicture}
      <div className="statistics">
        {formatLikesText() && (
          <div>
            <p
              onMouseEnter={toggleAllLikesAppearance}
              onMouseLeave={toggleAllLikesAppearance}
            >
              Liked by <span>{formatLikesText()}</span>
            </p>
            {showAllLikes && (
              <div className="all-likes">{likesNamesElements}</div>
            )}
          </div>
        )}
        <div>
          <p onClick={toggleAllCommentsAppearance}>
            {postComments.length === 1
              ? '1 comment'
              : `${postCommentsElements.length} comments`}
          </p>
          <div>
            <p
              onMouseEnter={toggleAllSharesAppearance}
              onMouseLeave={toggleAllSharesAppearance}
            >
              {postSharedBy.length === 1
                ? `1 share`
                : `${postSharedBy.length} shares`}
            </p>
            {showAllShares && (
              <div className="all-shares">{sharedByUniqueNamesElements}</div>
            )}
          </div>
        </div>
      </div>
      <div className="actions">
        <button
          onClick={handleLikePress}
          className={`${
            postLikedBy.find((like) => like._id === userData._id)
              ? 'pressed'
              : ''
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="48"
            viewBox="0 -960 960 960"
            width="48"
          >
            <path d="M716-120H272v-512l278-288 39 31q6 5 9 14t3 22v10l-45 211h299q24 0 42 18t18 42v81.839q0 7.161 1.5 14.661T915-461L789-171q-8.878 21.25-29.595 36.125Q738.689-120 716-120Zm-384-60h397l126-299v-93H482l53-249-203 214v427Zm0-427v427-427Zm-60-25v60H139v392h133v60H79v-512h193Z" />
          </svg>
          <div>
            {postLikedBy.find((like) => like._id === userData._id)
              ? 'Liked'
              : 'Like'}
          </div>
        </button>
        <button onClick={handleCommentPress}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="48"
            viewBox="0 -960 960 960"
            width="48"
          >
            <path d="M80-80v-740q0-24 18-42t42-18h680q24 0 42 18t18 42v520q0 24-18 42t-42 18H240L80-80Zm134-220h606v-520H140v600l74-80Zm-74 0v-520 520Z" />
          </svg>
          <div>Comment</div>
        </button>
        <button onClick={toggleSharePostAppearance}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="48"
            viewBox="0 -960 960 960"
            width="48"
          >
            <path d="M727-80q-47.5 0-80.75-33.346Q613-146.693 613-194.331q0-6.669 1.5-16.312T619-228L316-404q-15 17-37 27.5T234-366q-47.5 0-80.75-33.25T120-480q0-47.5 33.25-80.75T234-594q23 0 44 9t38 26l303-174q-3-7.071-4.5-15.911Q613-757.75 613-766q0-47.5 33.25-80.75T727-880q47.5 0 80.75 33.25T841-766q0 47.5-33.25 80.75T727-652q-23.354 0-44.677-7.5T646-684L343-516q2 8 3.5 18.5t1.5 17.741q0 7.242-1.5 15Q345-457 343-449l303 172q15-14 35-22.5t46-8.5q47.5 0 80.75 33.25T841-194q0 47.5-33.25 80.75T727-80Zm.035-632Q750-712 765.5-727.535q15.5-15.535 15.5-38.5T765.465-804.5q-15.535-15.5-38.5-15.5T688.5-804.465q-15.5 15.535-15.5 38.5t15.535 38.465q15.535 15.5 38.5 15.5Zm-493 286Q257-426 272.5-441.535q15.5-15.535 15.5-38.5T272.465-518.5q-15.535-15.5-38.5-15.5T195.5-518.465q-15.5 15.535-15.5 38.5t15.535 38.465q15.535 15.5 38.5 15.5Zm493 286Q750-140 765.5-155.535q15.5-15.535 15.5-38.5T765.465-232.5q-15.535-15.5-38.5-15.5T688.5-232.465q-15.5 15.535-15.5 38.5t15.535 38.465q15.535 15.5 38.5 15.5ZM727-766ZM234-480Zm493 286Z" />
          </svg>
          <div>Share</div>
        </button>
      </div>
      <form>
        <img src={userAvatarPicture} alt="Avatar" />
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
      {postCommentsElements ? (
        <>
          {postCommentsElements[0]}
          {postCommentsElements.length > 1 ? (
            <button
              className="show-comments"
              onClick={toggleAllCommentsAppearance}
            >
              View all {postCommentsElements.length} comments
            </button>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

Post.propTypes = {
  token: PropTypes.string,
  userData: PropTypes.object,
  postData: PropTypes.object,
  updateSingleFeedPost: PropTypes.func,
  handleNewErr: PropTypes.func,
};

export default Post;
