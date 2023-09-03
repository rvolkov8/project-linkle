import { Routes, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import LogIn from './LogIn';
import SignUp from './SignUp';
import Home from './Home';
import { useState } from 'react';
import SidebarMenu from './SidebarMenu';

const Main = ({ token, setToken, userData, err, handleNewErr }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const sideBarMenuElement = (
    <SidebarMenu currentPage={currentPage} setCurrentPage={setCurrentPage} />
  );

  return (
    <main className="main">
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
              sideBarMenuElement={sideBarMenuElement}
              userData={userData}
              err={err}
              handleNewErr={handleNewErr}
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
};

export default Main;
