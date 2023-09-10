import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';

const SearchResult = ({ resultData, setSearchInput }) => {
  const navigate = useNavigate();
  const avatarPicture = resultData.avatarFileName
    ? `${import.meta.env.VITE_SERVER}/images/avatars/${
        resultData.avatarFileName
      }`
    : `${import.meta.env.VITE_SERVER}/images/avatars/avatar.jpg`;
  const fullName = `${resultData.firstName} ${resultData.lastName}`;

  return (
    <div
      className="result"
      onClick={() => {
        setSearchInput('');
        navigate(`/profile/${resultData._id}`);
      }}
    >
      <img src={avatarPicture} alt="Avatar" /> <h3>{fullName}</h3>
    </div>
  );
};

SearchResult.propTypes = {
  resultData: PropTypes.object,
  setSearchInput: PropTypes.func,
};

export default SearchResult;
