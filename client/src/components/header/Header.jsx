import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import SearchResults from './SearchResults';

const Header = ({ userData, token, handleNewErr }) => {
  const [userLogged, setUserLogged] = useState(
    window.location.pathname === '/login' ||
      window.location.pathname === '/signup'
      ? false
      : true
  );
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [searchResultsData, setSearchResultsData] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [err, setErr] = useState('');

  const userFullName = `${userData.firstName} ${userData.lastName}`;

  useEffect(() => {
    if (
      window.location.pathname === '/login' ||
      window.location.pathname === '/signup'
    ) {
      setUserLogged(false);
    } else {
      setUserLogged(true);
    }
  }, [window.location.pathname]);

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const updateSearchResultsData = async () => {
    const res = await fetch(
      `${
        import.meta.env.VITE_SERVER
      }/api/user/search?searchInput=${searchInput}`,
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
      return setErr(err);
    }

    const data = await res.json();
    if (data.length === 0) {
      return setNoResults(true);
    }
    setErr('');
    setNoResults(false);
    setSearchResultsData(data);
  };

  useEffect(() => {
    if (searchInput) {
      updateSearchResultsData();
    }
  }, [searchInput]);

  if (userLogged) {
    return (
      <header className="user-header">
        <h1 className="logo" onClick={() => navigate('/')}>
          Linkle
        </h1>
        <div className="search">
          <input
            type="text"
            onChange={handleSearchInputChange}
            value={searchInput}
            placeholder="Find new connections..."
          />
          {searchInput && (
            <SearchResults
              searchResultsData={searchResultsData}
              err={err}
              noResults={noResults}
              setSearchInput={setSearchInput}
            />
          )}
        </div>
        <div>
          <div
            className="user-info"
            onClick={() => {
              navigate(`/profile/${userData._id}`);
            }}
          >
            <img src={userData.avatarUrl} alt="Avatar" />
            {userData.firstName ? <h2>{userFullName}</h2> : <h2>Loading...</h2>}
          </div>
          <div className="divider"></div>
          <svg
            onClick={(event) => {
              event.stopPropagation();
              handleNewErr('Messenger functionality will be implemented soon.');
            }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <title>Messenger</title>
            <path d="M12,2C6.36,2 2,6.13 2,11.7C2,14.61 3.19,17.14 5.14,18.87C5.3,19 5.4,19.22 5.41,19.44L5.46,21.22C5.5,21.79 6.07,22.16 6.59,21.93L8.57,21.06C8.74,21 8.93,20.97 9.1,21C10,21.27 11,21.4 12,21.4C17.64,21.4 22,17.27 22,11.7C22,6.13 17.64,2 12,2M18,9.46L15.07,14.13C14.6,14.86 13.6,15.05 12.9,14.5L10.56,12.77C10.35,12.61 10.05,12.61 9.84,12.77L6.68,15.17C6.26,15.5 5.71,15 6,14.54L8.93,9.87C9.4,9.14 10.4,8.95 11.1,9.47L13.44,11.23C13.66,11.39 13.95,11.39 14.16,11.23L17.32,8.83C17.74,8.5 18.29,9 18,9.46Z" />
          </svg>
        </div>
      </header>
    );
  } else {
    return (
      <header className="no-user-header">
        <h1 className="logo">Linkle</h1>
      </header>
    );
  }
};

Header.propTypes = {
  userData: PropTypes.object,
  token: PropTypes.string,
  handleNewErr: PropTypes.func,
};

export default Header;
