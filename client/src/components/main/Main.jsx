import { Routes, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import LogIn from './LogIn';
import SignUp from './SignUp';
import Home from './Home';
import SidebarMenu from './SidebarMenu';
import Profile from './Profile';
import Friends from './Friends';
import FriendsRequests from './FriendRequests';

const Main = ({
  token,
  setToken,
  userData,
  err,
  handleNewErr,
  updateUserData,
}) => {
  return (
    <main className="main">
      <SidebarMenu userData={userData} />
      <Routes>
        <Route
          path="/login"
          element={<LogIn token={token} setToken={setToken} />}
        />
        <Route path="/signup" element={<SignUp token={token} />} />
        <Route
          path="/"
          element={
            <Home
              token={token}
              userData={userData}
              err={err}
              handleNewErr={handleNewErr}
            />
          }
        />
        <Route
          path="/profile/:id"
          element={
            <Profile
              token={token}
              userData={userData}
              err={err}
              handleNewErr={handleNewErr}
              updateUserData={updateUserData}
            />
          }
        />
        <Route
          path="/profile/:id/friends"
          element={
            <Friends
              token={token}
              userData={userData}
              err={err}
              handleNewErr={handleNewErr}
            />
          }
        />
        <Route
          path="/profile/:id/friend-requests"
          element={
            <FriendsRequests
              token={token}
              userData={userData}
              err={err}
              handleNewErr={handleNewErr}
              updateUserData={updateUserData}
            />
          }
        />
      </Routes>
    </main>
  );
};

Main.propTypes = {
  token: PropTypes.string,
  setToken: PropTypes.func,
  userData: PropTypes.object,
  err: PropTypes.string,
  handleNewErr: PropTypes.func,
  updateUserData: PropTypes.func,
};

export default Main;
