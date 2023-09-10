import PropTypes from 'prop-types';

const Intro = ({ profileData }) => {
  if (!profileData.bio && !profileData.currentCity && !profileData.homeTown) {
    return null;
  }

  const currentCityElement = profileData.currentCity ? (
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <title>map-marker</title>
        <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
      </svg>
      <p>
        Lives in <strong>{profileData.currentCity}</strong>
      </p>
    </div>
  ) : null;

  const homeTownElement = profileData.homeTown ? (
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <title>home</title>
        <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
      </svg>
      <p>
        From <strong>{profileData.homeTown}</strong>
      </p>
    </div>
  ) : null;

  return (
    <div className="intro">
      <h2>Intro</h2>
      <div className="content">
        {profileData.bio && <p className="bio">{profileData.bio}</p>}
        {currentCityElement}
        {homeTownElement}
      </div>
    </div>
  );
};

Intro.propTypes = {
  profileData: PropTypes.object,
};

export default Intro;
