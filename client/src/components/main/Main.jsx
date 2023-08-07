import { Routes, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import LogIn from './LogIn';

const Main = ({ token, setToken }) => {
  return (
    <main className="main">
      <Routes>
        <Route
          path="/login"
          element={<LogIn token={token} setToken={setToken} />}
        />
      </Routes>
    </main>
  );
};

Main.propTypes = {
  token: PropTypes.string,
  setToken: PropTypes.func,
};

export default Main;
