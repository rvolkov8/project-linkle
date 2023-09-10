import { useEffect, useState } from 'react';
import Main from './components/main/Main';
import Header from './components/header/Header';
import { useLocation, useNavigate } from 'react-router-dom';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState({});
  const [err, setErr] = useState('');
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  const handleNewErr = (err) => {
    setErr(err);
    setTimeout(() => {
      setErr('');
    }, 4000);
  };

  const updateUserData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER}/api/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = res.statusText;
        throw new Error(err);
      }

      const data = await res.json();
      setUserData(data);
    } catch (err) {
      console.error('Error when trying to update user data:', err);
    }
  };

  // Store the current URL in localStorage when the URL changes
  useEffect(() => {
    localStorage.setItem('currentURL', location.pathname);
    window.dispatchEvent(new Event('storage'));
  }, [location.pathname]);

  // When the page is reloaded, navigate to the stored URL
  useEffect(() => {
    const storedURL = localStorage.getItem('currentURL');
    if (storedURL) {
      navigate(storedURL);
    }
  }, [navigate]);

  // Sets token in the localStorage if it changes in the state
  useEffect(() => {
    if (!token) {
      return;
    }
    localStorage.setItem('token', token);
  }, [token]);

  const checkToken = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER}/api`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const err = res.statusText;
        throw new Error(err);
      }
    } catch (err) {
      console.error('Error when trying to check token:', err);
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

  // Updates user data
  useEffect(() => {
    if (!token) {
      return;
    }
    updateUserData();
  }, [token]);

  // Add event listener to track online/offline changes
  useEffect(() => {
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));
    window.addEventListener('beforeunload', () => {
      setIsOnline(false);
    });
    return () => {
      window.removeEventListener('online');
      window.removeEventListener('offline');
    };
  }, []);

  // Update user online/offline status
  const updateUserStatus = async (status) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER}/api/user/me/${status}`,
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
    } catch (err) {
      handleNewErr(err);
    }
  };

  useEffect(() => {
    if (!token) {
      return;
    }
    if (userData && isOnline) {
      updateUserStatus('online');
    } else {
      updateUserStatus('offline');
    }
  }, [isOnline]);

  return (
    <>
      <Header userData={userData} token={token} />
      <Main
        token={token}
        setToken={setToken}
        userData={userData}
        err={err}
        handleNewErr={handleNewErr}
        updateUserData={updateUserData}
      />
    </>
  );
};

export default App;
