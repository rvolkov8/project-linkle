import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SidebarMenu = ({ userData }) => {
  const [currentPage, setCurrentPage] = useState('');

  useEffect(() => {
    const handleCurrentUrlChange = () => {
      const currentURL = localStorage.getItem('currentURL');

      if (currentURL === '/' && currentPage !== 'home') {
        return setCurrentPage('home');
      } else if (
        currentURL.split('/')[1] === 'profile' &&
        currentURL.split('/')[2] === userData._id &&
        currentPage !== 'profile'
      ) {
        return setCurrentPage('profile');
      } else if (
        currentURL.split('/')[1] === 'profile' &&
        currentURL.split('/')[2] !== userData._id
      ) {
        return setCurrentPage('');
      }
    };

    window.addEventListener('storage', handleCurrentUrlChange);
    handleCurrentUrlChange();
    return () => {
      window.removeEventListener('storage', handleCurrentUrlChange);
    };
  }, [userData._id]);

  return (
    <div className="sidebar-menu">
      <Link
        to={`/profile/${userData._id}`}
        className={`option ${currentPage === 'profile' ? 'active' : ''}`}
        onClick={() => {
          setCurrentPage('profile');
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>profile</title>
          <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6M12,13C14.67,13 20,14.33 20,17V20H4V17C4,14.33 9.33,13 12,13M12,14.9C9.03,14.9 5.9,16.36 5.9,17V18.1H18.1V17C18.1,16.36 14.97,14.9 12,14.9Z" />
        </svg>
      </Link>
      <Link
        to={'/'}
        className={`option ${currentPage === 'home' ? 'active' : ''}`}
        onClick={() => {
          setCurrentPage('home');
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>home</title>
          <path d="M12 5.69L17 10.19V18H15V12H9V18H7V10.19L12 5.69M12 3L2 12H5V20H11V14H13V20H19V12H22" />
        </svg>
      </Link>
      <div
        className={`option ${currentPage === 'friends' ? 'active' : ''}`}
        onClick={() => {
          setCurrentPage('friends');
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>friends</title>
          <path d="M12,5A3.5,3.5 0 0,0 8.5,8.5A3.5,3.5 0 0,0 12,12A3.5,3.5 0 0,0 15.5,8.5A3.5,3.5 0 0,0 12,5M12,7A1.5,1.5 0 0,1 13.5,8.5A1.5,1.5 0 0,1 12,10A1.5,1.5 0 0,1 10.5,8.5A1.5,1.5 0 0,1 12,7M5.5,8A2.5,2.5 0 0,0 3,10.5C3,11.44 3.53,12.25 4.29,12.68C4.65,12.88 5.06,13 5.5,13C5.94,13 6.35,12.88 6.71,12.68C7.08,12.47 7.39,12.17 7.62,11.81C6.89,10.86 6.5,9.7 6.5,8.5C6.5,8.41 6.5,8.31 6.5,8.22C6.2,8.08 5.86,8 5.5,8M18.5,8C18.14,8 17.8,8.08 17.5,8.22C17.5,8.31 17.5,8.41 17.5,8.5C17.5,9.7 17.11,10.86 16.38,11.81C16.5,12 16.63,12.15 16.78,12.3C16.94,12.45 17.1,12.58 17.29,12.68C17.65,12.88 18.06,13 18.5,13C18.94,13 19.35,12.88 19.71,12.68C20.47,12.25 21,11.44 21,10.5A2.5,2.5 0 0,0 18.5,8M12,14C9.66,14 5,15.17 5,17.5V19H19V17.5C19,15.17 14.34,14 12,14M4.71,14.55C2.78,14.78 0,15.76 0,17.5V19H3V17.07C3,16.06 3.69,15.22 4.71,14.55M19.29,14.55C20.31,15.22 21,16.06 21,17.07V19H24V17.5C24,15.76 21.22,14.78 19.29,14.55M12,16C13.53,16 15.24,16.5 16.23,17H7.77C8.76,16.5 10.47,16 12,16Z" />
        </svg>
      </div>
    </div>
  );
};

SidebarMenu.propTypes = {
  userData: PropTypes.object,
};

export default SidebarMenu;
