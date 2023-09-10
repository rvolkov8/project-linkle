import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LogIn = ({ token, setToken }) => {
  const navigate = useNavigate();
  const [err, setErr] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const checkToken = async () => {
    const res = await fetch(`${import.meta.env.VITE_SERVER}/api`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      return navigate('/');
    }
  };

  useEffect(() => {
    if (!token) {
      return;
    }
    checkToken();
  }, []);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userInput = {
        username: username,
        password: password,
      };

      const res = await fetch(`${import.meta.env.VITE_SERVER}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInput),
      });
      if (!res.ok) {
        return setErr(res.statusText);
      }
      const data = await res.json();
      setErr('');
      setToken(data.token);
      navigate('/');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleGuestLogIn = async () => {
    try {
      const userInput = {
        username: 'guest',
        password: '11111111',
      };

      const res = await fetch(`${import.meta.env.VITE_SERVER}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInput),
      });
      if (!res.ok) {
        return setErr(res.statusText);
      }
      const data = await res.json();
      setErr('');
      setToken(data.token);
      navigate('/');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="log-in">
      <h1>Welcome back!</h1>
      <h2>Log in to your profile</h2>
      {err && <h3>{err}</h3>}
      <form autoComplete="off" onSubmit={handleSubmit}>
        <div className="field">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6M12,13C14.67,13 20,14.33 20,17V20H4V17C4,14.33 9.33,13 12,13M12,14.9C9.03,14.9 5.9,16.36 5.9,17V18.1H18.1V17C18.1,16.36 14.97,14.9 12,14.9Z" />
          </svg>
          <input
            type="text"
            onChange={handleUsernameChange}
            value={username}
            placeholder="Username"
          />
        </div>
        <div className="field">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>lock-outline</title>
            <path d="M12,17C10.89,17 10,16.1 10,15C10,13.89 10.89,13 12,13A2,2 0 0,1 14,15A2,2 0 0,1 12,17M18,20V10H6V20H18M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V10C4,8.89 4.89,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
          </svg>
          <input
            type={showPassword ? 'text' : 'password'}
            onChange={handlePasswordChange}
            value={password}
            placeholder="Password"
          />
          <button
            type="button"
            className="show-password-button"
            onClick={toggleShowPassword}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <button
          type="submit"
          className={username && password ? 'enabled' : 'disabled'}
          disabled={username && password ? false : true}
        >
          Log in
        </button>
      </form>
      <button
        type="button"
        onClick={handleGuestLogIn}
        className="guest-log-in-button"
      >
        Log in as a guest
      </button>
      <p>
        Don&#39;t have a profile?{' '}
        <Link className="sign-up-link" to="/signup">
          Sign up
        </Link>
      </p>
    </div>
  );
};

LogIn.propTypes = {
  token: PropTypes.string,
  setToken: PropTypes.func,
};

export default LogIn;
