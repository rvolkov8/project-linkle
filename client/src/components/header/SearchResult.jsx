import PropTypes from 'prop-types';

const SearchResult = ({ resultData }) => {
  const avatarPicture = resultData.avatarFileName
    ? `${import.meta.env.VITE_SERVER}/images/avatars/${
        resultData.avatarFileName
      }`
    : `${import.meta.env.VITE_SERVER}/images/avatars/avatar.jpg`;
  const fullName = `${resultData.firstName} ${resultData.lastName}`;

  return (
    <div className="result">
      <img src={avatarPicture} alt="Avatar" /> <h3>{fullName}</h3>
    </div>
  );
};

SearchResult.propTypes = {
  resultData: PropTypes.object,
};

export default SearchResult;
