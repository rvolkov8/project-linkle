import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Friend from './Friend';

const Friends = ({ token, userData, err, handleNewErr }) => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(
    id === userData._id ? userData : {}
  );
  const navigate = useNavigate();
  const [friendsData, setFriendsData] = useState([]);
  const [friendsElements, setFriendsElements] = useState([]);
  const [friendsSearch, setFriendsSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const isCurrentUser = id === userData._id;

  const handleFriendsSearchChange = (event) => {
    setFriendsSearch(event.target.value);
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
    const updateFriendsData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER}/api/user/${
            profileData._id
          }?fields=friends`,
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
        setIsLoading(false);
        setFriendsData(sortedFriendsData);
      } catch (err) {
        handleNewErr(err);
      }
    };

    if (profileData._id) {
      updateFriendsData();
      // Store the interval ID when setting up the interval
      const intervalId = setInterval(() => {
        updateFriendsData();
      }, 15000);

      // Clear the interval when the component unmounts
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [profileData]);

  useEffect(() => {
    if (friendsData?.length > 0 && !friendsSearch) {
      const elements = friendsData.map((friendData) => (
        <Friend
          key={friendData._id}
          friendData={friendData}
          handleNewErr={handleNewErr}
        />
      ));
      setFriendsElements(elements);
    }

    if (friendsData?.length > 0 && friendsSearch) {
      const filteredFriends = friendsData.filter((friend) =>
        friend.fullName.toLowerCase().includes(friendsSearch.toLowerCase())
      );
      const elements = filteredFriends.map((friendData) => (
        <Friend
          key={friendData._id}
          friendData={friendData}
          handleNewErr={handleNewErr}
        />
      ));
      setFriendsElements(elements);
    }
  }, [friendsData, friendsSearch]);

  return (
    <>
      <div className="middle-column">
        {err && <p className="err">{err}</p>}
        <div className="friends">
          <div className="heading">
            <div>
              {isCurrentUser ? (
                <>
                  <h1>Friends</h1>
                  <h1
                    onClick={() => {
                      navigate(`/profile/${profileData._id}/friend-requests`);
                    }}
                  >
                    Requests
                  </h1>
                </>
              ) : (
                <h1 style={{ gridColumn: '1 / 3' }}>
                  {profileData.firstName
                    ? `${profileData.firstName}'s`
                    : 'Loading'}{' '}
                  friends
                </h1>
              )}
            </div>
            <input
              type="text"
              placeholder="Search friends..."
              onChange={handleFriendsSearchChange}
              value={friendsSearch}
            />
          </div>
          <div className="container">
            {isLoading && (
              <div className="dots-container">
                <div className="dots"></div>
              </div>
            )}
            {friendsElements.length > 0 && !isLoading ? friendsElements : null}
            {friendsElements.length < 1 && !isLoading && !friendsSearch ? (
              <p>{profileData.firstName} doesn&apos;t have any friends yet.</p>
            ) : null}
            {friendsElements.length < 1 && !isLoading && friendsSearch ? (
              <p>
                {profileData.firstName} doesn&apos;t have any friends with that
                name.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

Friends.propTypes = {
  token: PropTypes.string,
  sideBarMenuElement: PropTypes.element,
  userData: PropTypes.object,
  err: PropTypes.string,
  handleNewErr: PropTypes.func,
  updateUserData: PropTypes.func,
};

export default Friends;
