import { useEffect, useState } from 'react';
import Main from './components/main/Main';
import Header from './components/header/Header';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const navigate = useNavigate();

  // Sets token in the localStorage if it changes in the state
  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  const checkToken = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER}/api`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (
        !res.ok &&
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/signup'
      ) {
        return navigate('/login');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  // Authentication logic using useEffect and token state. Redirects to login page if token is missing or invalid.
  useEffect(() => {
    if (
      !token &&
      window.location.pathname !== '/login' &&
      window.location.pathname !== '/signup'
    ) {
      return navigate('/login');
    }

    checkToken();
  }, [token]);

  return (
    <>
      <Header />
      <Main token={token} setToken={setToken} />
    </>
  );
};

export default App;
