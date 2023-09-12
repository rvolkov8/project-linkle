import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';

const SearchResult = ({ resultData, setSearchInput }) => {
  const navigate = useNavigate();
  const fullName = `${resultData.firstName} ${resultData.lastName}`;

  return (
    <div
      className="result"
      onClick={() => {
        setSearchInput('');
        navigate(`/profile/${resultData._id}`);
      }}
    >
      <img src={resultData.avatarUrl} alt="Avatar" /> <h3>{fullName}</h3>
    </div>
  );
};

SearchResult.propTypes = {
  resultData: PropTypes.object,
  setSearchInput: PropTypes.func,
};

export default SearchResult;
