import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import FriendRequest from './FriendRequest';

const FriendsRequests = ({
  token,
  userData,
  err,
  handleNewErr,
  updateUserData,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [friendRequestsElements, setFriendRequestsElements] = useState([]);

  const [requestSearch, setRequestSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const handleRequestSearchChange = (event) => {
    setRequestSearch(event.target.value);
  };

  useEffect(() => {
    if (id !== userData._id) {
      navigate(`/profile/${id}/friends`);
    }
  }, [id, userData]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [userData]);

  useEffect(() => {
    if (userData.friendRequests && !requestSearch) {
      const elements = userData.friendRequests.map((friendRequestData) => (
        <FriendRequest
          key={friendRequestData._id}
          friendRequestData={friendRequestData}
          token={token}
          handleNewErr={handleNewErr}
          updateUserData={updateUserData}
        />
      ));
      setIsLoading(false);
      setFriendRequestsElements(elements);
    }
    if (userData.friendRequests && requestSearch) {
      const filteredFriendRequests = userData.friendRequests.filter(
        (friendRequestData) =>
          friendRequestData.user.fullName
            .toLowerCase()
            .includes(requestSearch.toLowerCase())
      );
      const elements = filteredFriendRequests.map((friendRequestData) => (
        <FriendRequest
          key={friendRequestData._id}
          friendRequestData={friendRequestData}
        />
      ));
      setIsLoading(false);
      setFriendRequestsElements(elements);
    }
  }, [userData, requestSearch]);

  return (
    <>
      <div className="middle-column">
        {err && <p className="err">{err}</p>}
        <div className="friend-requests">
          <div className="heading">
            <div>
              <h1
                onClick={() => {
                  navigate(`/profile/${userData._id}/friends`);
                }}
              >
                Friends
              </h1>
              <h1>Requests</h1>
            </div>
            <input
              type="text"
              placeholder="Search friend requests..."
              onChange={handleRequestSearchChange}
              value={requestSearch}
            />
          </div>
          <div className="container">
            {isLoading && (
              <div className="dots-container">
                <div className="dots"></div>
              </div>
            )}
            {friendRequestsElements.length > 0 && !isLoading
              ? friendRequestsElements
              : null}
            {friendRequestsElements.length < 1 &&
            !isLoading &&
            !requestSearch ? (
              <p>You don&apos;t have any friend requests yet.</p>
            ) : null}
            {friendRequestsElements.length < 1 &&
            !isLoading &&
            requestSearch ? (
              <p>
                You don&apos;t have any friend requests from the user with that
                name.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

FriendsRequests.propTypes = {
  token: PropTypes.string,
  sideBarMenuElement: PropTypes.element,
  userData: PropTypes.object,
  err: PropTypes.string,
  handleNewErr: PropTypes.func,
  updateUserData: PropTypes.func,
};

export default FriendsRequests;
