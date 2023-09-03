import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import SearchResult from './SearchResult';

const SearchResults = ({ searchResultsData, err, noResults }) => {
  const [searchResultsElements, setSearchResultsElements] = useState([]);

  const updateSearchResultsElements = () => {
    if (searchResultsData.length > 0) {
      const elements = searchResultsData.map((resultData) => {
        return <SearchResult key={resultData._id} resultData={resultData} />;
      });
      setSearchResultsElements(elements);
    }
  };

  useEffect(() => {
    if (searchResultsData.length > 0) {
      updateSearchResultsElements();
    }
  }, [searchResultsData]);

  if (err) {
    return (
      <div className="search-results">
        <p>{err}</p>
      </div>
    );
  }
  // No user with such name is found
  if (noResults) {
    return (
      <div className="search-results">
        <p>Sorry, the user you&apos;re looking for is not found. </p>
      </div>
    );
  }
  // Certain users are found
  if (searchResultsElements.length > 0) {
    return <div className="search-results">{searchResultsElements}</div>;
  }
  // Waiting for response for the server
  return (
    <div className="search-results">
      <div className="dots"></div>
    </div>
  );
};

SearchResults.propTypes = {
  searchResultsData: PropTypes.array,
  err: PropTypes.string,
  noResults: PropTypes.bool,
};

export default SearchResults;
