import PropTypes from 'prop-types';
import NewPost from './NewPost';
import Post from './Post';
import { useEffect, useState } from 'react';
import Friend from './Friend';

const Home = ({ token, userData, err, handleNewErr }) => {
  const [friendsData, setFriendsData] = useState([]);
  const [friendsElements, setFriendsElements] = useState([]);
  const [feedPostsData, setFeedPostsData] = useState([]);
  const [feedPostsElements, setFeedPostsElements] = useState([]);
  const [loadingFeedPosts, setLoadingFeedPosts] = useState(false);

  const updateSingleFeedPost = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER}/api/post/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const data = await res.json();
        const err = data.msg;
        return handleNewErr(err);
      }

      const updatedPostData = await res.json();

      const authorIsCurrentUser = userData._id === updatedPostData.author._id;
      const alreadyShown = feedPostsData.some(
        (post) => post._id === updatedPostData._id
      );

      if (authorIsCurrentUser && !alreadyShown) {
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

  const updateFeedPostsData = async () => {
    try {
      setLoadingFeedPosts(true);
      const res = await fetch(`${import.meta.env.VITE_SERVER}/api/feed-posts`, {
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

      const data = await res.json();
      setFeedPostsData(data);
      setLoadingFeedPosts(false);
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

  const updateFriendsData = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER}/api/user/me?fields=friends`,
        {
          method: 'GET',
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

      const data = await res.json();
      const friendsData = data.friends;
      const sortedFriendsData = friendsData.sort(
        (a, b) => b.isOnline - a.isOnline
      );
      setFriendsData(sortedFriendsData);
    } catch (err) {
      handleNewErr(err);
    }
  };

  const updateFriendsElements = () => {
    const elements = friendsData.map((friend) => {
      return <Friend key={friend._id} friendData={friend} />;
    });
    setFriendsElements(elements);
  };

  useEffect(() => {
    if (userData.friends !== undefined && userData.friends.length > 0) {
      updateFeedPostsData();
    }
  }, [userData.friends]);

  useEffect(() => {
    updateFeedPostsElements();
  }, [feedPostsData]);

  useEffect(() => {
    if (!token) {
      return;
    }
    updateFriendsData();
    // Store the interval ID when setting up the interval
    const intervalId = setInterval(() => {
      updateFriendsData();
    }, 15000);

    // Clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    updateFriendsElements();
  }, [friendsData]);

  useEffect(() => {}, [friendsData]);

  return (
    <>
      {/* <div className="left-column">{sideBarMenuElement}</div> */}
      <div className="middle-column">
        {err && <p className="err">{err}</p>}
        <NewPost
          token={token}
          userData={userData}
          updateSingleFeedPost={updateSingleFeedPost}
        />
        {loadingFeedPosts && <div className="dots"></div>}
        {feedPostsElements.length === 0 && !loadingFeedPosts ? (
          <h4>Add friends to see their activity.</h4>
        ) : null}
        {feedPostsElements.length > 0 ? feedPostsElements : null}
      </div>
      <div className="right-column">
        {friendsElements.length > 0 && (
          <div className="friends">
            <h2>Friends</h2>
            <div className="container">
              <div>{friendsElements}</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

Home.propTypes = {
  token: PropTypes.string,
  sideBarMenuElement: PropTypes.element,
  userData: PropTypes.object,
  err: PropTypes.string,
  handleNewErr: PropTypes.func,
};

export default Home;
