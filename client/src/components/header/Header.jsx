import { useState } from 'react';

const Header = () => {
  const [userLogged] = useState(
    window.location.pathname === '/login' ||
      window.location.pathname === '/signup'
      ? false
      : true
  );

  if (userLogged) {
    return <div>User logged</div>;
  } else {
    return (
      <header className="no-user-header">
        <h1 className="logo">Linkle</h1>
      </header>
    );
  }
};

export default Header;
