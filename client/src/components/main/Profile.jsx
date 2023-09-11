import PropTypes from 'prop-types';
import Post from './Post';
import { useEffect, useState } from 'react';
import NewPost from './NewPost';
import Intro from './Intro';
import FriendsPreview from './FriendsPreview';
import { useParams } from 'react-router';
import EditProfile from './EditProfile';

const Profile = ({ token, userData, err, handleNewErr, updateUserData }) => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(
    id === userData._id ? userData : {}
  );
  const [feedPostsData, setFeedPostsData] = useState([]);
  const [feedPostsElements, setFeedPostsElements] = useState([]);
  const [loadingFeedPosts, setLoadingFeedPosts] = useState(true);
  const [showEditProfileElement, setShowEditProfileElement] = useState(false);

  const isCurrentUser = id === userData._id;

  const updateSingleFeedPost = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER}/api/post/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const data = await res.json();
        const err = data.msg;
        return handleNewErr(err);
      }

      const updatedPostData = await res.json();

      const alreadyShown = feedPostsData.some(
        (post) => post._id === updatedPostData._id
      );

      if (!alreadyShown) {
        setFeedPostsData((prevFeedPostsData) => {
          const updatedFeedPostsData = [updatedPostData, ...prevFeedPostsData];
          return updatedFeedPostsData;
        });
      }

      setFeedPostsData((prevFeedPostsData) => {
        const updatedFeedPostsData = prevFeedPostsData.map((post) => {
          if (post._id === updatedPostData._id) {
            return updatedPostData;
          }
          return post;
        });
        return updatedFeedPostsData;
      });
    } catch (err) {
      handleNewErr(err);
    }
  };

  const updateFeedPostsElements = () => {
    const postsElements = feedPostsData.map((post) => {
      return (
        <Post
          key={post._id}
          token={token}
          userData={userData}
          postData={post}
          updateSingleFeedPost={updateSingleFeedPost}
          handleNewErr={handleNewErr}
        />
      );
    });
    setFeedPostsElements(postsElements);
  };

  const handleLogOut = () => {
    localStorage.removeItem('currentURL');
    localStorage.removeItem('token');
    window.location.reload();
  };

  const toggleShowEditProfileElement = () => {
    setShowEditProfileElement(!showEditProfileElement);
  };

  const handleRemoveFriend = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER}/api/user/me/remove-friend?friendId=${
          profileData._id
        }`,
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

  const handleSendFriendRequest = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER}/api/user/${
          profileData._id
        }/friend-request/send`,
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

  const handleCancelFriendRequest = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER}/api/user/${
          profileData._id
        }/friend-request/cancel`,
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

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [profileData]);

  useEffect(() => {
    const getProfileData = async () => {
      const res = await fetch(`${import.meta.env.VITE_SERVER}/api/user/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const data = await res.json();
        const err = data.msg;
        handleNewErr(err);
      }
      const data = await res.json();
      setProfileData(data);
    };

    if (isCurrentUser) {
      setProfileData(userData);
    } else {
      getProfileData();
    }
  }, [id, userData]);

  useEffect(() => {
    if (profileData.posts?.length > 0) {
      setFeedPostsData(profileData.posts);
    } else {
      setFeedPostsData([]);
    }
  }, [profileData]);

  useEffect(() => {
    if (feedPostsData.length < 1) {
      setFeedPostsElements([]);
    }
    updateFeedPostsElements();
    setLoadingFeedPosts(false);
  }, [feedPostsData]);

  const profileAvatarPicture = profileData?.avatarFileName
    ? `${import.meta.env.VITE_SERVER}/images/avatars/${
        profileData.avatarFileName
      }`
    : `${import.meta.env.VITE_SERVER}/images/avatars/avatar.jpg`;

  const profileFullName = profileData.fullName;

  const profileFriendsText =
    profileData.friends && profileData.friends.length > 0 ? (
      <p>
        {profileData.friends.length === 1
          ? '1 friend'
          : `${profileData.friends.length} friends`}
      </p>
    ) : null;

  let profileHeaderButtons;
  const isFriend = userData.friends?.some(
    (friend) => friend._id === profileData._id
  );
  const receivedFriendRequest = profileData.friendRequests?.some(
    (request) => request.user === userData._id
  );
  const sentFriendRequest = userData.friendRequests?.some(
    (request) => request.user?._id === profileData._id
  );

  if (isCurrentUser) {
    profileHeaderButtons = (
      <div className="buttons">
        <button onClick={toggleShowEditProfileElement}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>pencil</title>
            <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
          </svg>
          Edit profile
        </button>
        <button className="log-out" onClick={handleLogOut}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>logout</title>
            <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
          </svg>
          Log out
        </button>
      </div>
    );
  }

  if (!isCurrentUser && isFriend) {
    profileHeaderButtons = (
      <div className="buttons">
        <button className="remove-friend" onClick={handleRemoveFriend}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>account-remove</title>
            <path d="M15,14C17.67,14 23,15.33 23,18V20H7V18C7,15.33 12.33,14 15,14M15,12A4,4 0 0,1 11,8A4,4 0 0,1 15,4A4,4 0 0,1 19,8A4,4 0 0,1 15,12M5,9.59L7.12,7.46L8.54,8.88L6.41,11L8.54,13.12L7.12,14.54L5,12.41L2.88,14.54L1.46,13.12L3.59,11L1.46,8.88L2.88,7.46L5,9.59Z" />
          </svg>
          Remove friend
        </button>
        <button className="message">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>Messenger</title>
            <path d="M12,2C6.36,2 2,6.13 2,11.7C2,14.61 3.19,17.14 5.14,18.87C5.3,19 5.4,19.22 5.41,19.44L5.46,21.22C5.5,21.79 6.07,22.16 6.59,21.93L8.57,21.06C8.74,21 8.93,20.97 9.1,21C10,21.27 11,21.4 12,21.4C17.64,21.4 22,17.27 22,11.7C22,6.13 17.64,2 12,2M18,9.46L15.07,14.13C14.6,14.86 13.6,15.05 12.9,14.5L10.56,12.77C10.35,12.61 10.05,12.61 9.84,12.77L6.68,15.17C6.26,15.5 5.71,15 6,14.54L8.93,9.87C9.4,9.14 10.4,8.95 11.1,9.47L13.44,11.23C13.66,11.39 13.95,11.39 14.16,11.23L17.32,8.83C17.74,8.5 18.29,9 18,9.46Z" />
          </svg>
          Message
        </button>
      </div>
    );
  }

  if (!isCurrentUser && !isFriend && !receivedFriendRequest) {
    profileHeaderButtons = (
      <div className="buttons">
        <button className="cancel-request" onClick={handleSendFriendRequest}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>account-plus</title>
            <path d="M15,14C12.33,14 7,15.33 7,18V20H23V18C23,15.33 17.67,14 15,14M6,10V7H4V10H1V12H4V15H6V12H9V10M15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12Z" />
          </svg>
          Add friend
        </button>
      </div>
    );
  }

  if (!isCurrentUser && !isFriend && receivedFriendRequest) {
    profileHeaderButtons = (
      <div className="buttons">
        <button className="add-friend" onClick={handleCancelFriendRequest}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>account-cancel</title>
            <path d="M10 4A4 4 0 0 0 6 8A4 4 0 0 0 10 12A4 4 0 0 0 14 8A4 4 0 0 0 10 4M17.5 13C15 13 13 15 13 17.5C13 20 15 22 17.5 22C20 22 22 20 22 17.5C22 15 20 13 17.5 13M10 14C5.58 14 2 15.79 2 18V20H11.5A6.5 6.5 0 0 1 11 17.5A6.5 6.5 0 0 1 11.95 14.14C11.32 14.06 10.68 14 10 14M17.5 14.5C19.16 14.5 20.5 15.84 20.5 17.5C20.5 18.06 20.35 18.58 20.08 19L16 14.92C16.42 14.65 16.94 14.5 17.5 14.5M14.92 16L19 20.08C18.58 20.35 18.06 20.5 17.5 20.5C15.84 20.5 14.5 19.16 14.5 17.5C14.5 16.94 14.65 16.42 14.92 16Z" />
          </svg>
          Cancel request
        </button>
      </div>
    );
  }

  if (!isCurrentUser && !isFriend && sentFriendRequest) {
    profileHeaderButtons = (
      <div className="buttons">
        <button className="confirm-request">Confirm</button>
        <button className="remove-request">Remove</button>
      </div>
    );
  }

  return (
    <>
      <div className="middle-column">
        {err && <p className="err">{err}</p>}
        {showEditProfileElement ? (
          <EditProfile
            token={token}
            userData={userData}
            toggleShowEditProfileElement={toggleShowEditProfileElement}
            updateUserData={updateUserData}
          />
        ) : null}
        <div className="profile-header">
          <img src={profileAvatarPicture} alt="Avatar" />
          <div>
            <h1>{profileFullName}</h1>
            <div>
              {profileFriendsText && profileFriendsText}
              {profileHeaderButtons}
            </div>
          </div>
        </div>
        <div className="content">
          <div className="left-content-column">
            <Intro profileData={profileData} />
            {profileData.friends?.length > 0 && (
              <FriendsPreview
                friendsData={profileData.friends}
                profileId={profileData._id}
              />
            )}
          </div>
          <div className="right-content-column">
            {isCurrentUser && (
              <NewPost
                token={token}
                userData={userData}
                updateSingleFeedPost={updateSingleFeedPost}
              />
            )}
            {loadingFeedPosts && (
              <div className="dots-container">
                <div className="dots"></div>
              </div>
            )}
            {feedPostsElements.length > 0 ? feedPostsElements : null}
            {feedPostsElements.length < 1 && !loadingFeedPosts ? (
              <p>{profileData.firstName} hasn&apos;t posted anything yet.</p>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

Profile.propTypes = {
  token: PropTypes.string,
  sideBarMenuElement: PropTypes.element,
  userData: PropTypes.object,
  err: PropTypes.string,
  handleNewErr: PropTypes.func,
  updateUserData: PropTypes.func,
};

export default Profile;
