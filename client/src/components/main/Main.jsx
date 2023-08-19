import { Routes, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import LogIn from './LogIn';
import SignUp from './SignUp';

const Main = ({ token, setToken }) => {
  return (
    <main className="main">
      <Routes>
        <Route
          path="/login"
          element={<LogIn token={token} setToken={setToken} />}
        />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </main>
  );
};

Main.propTypes = {
  token: PropTypes.string,
  setToken: PropTypes.func,
};

export default Main;
