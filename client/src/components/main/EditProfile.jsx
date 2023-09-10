import PropTypes from 'prop-types';
import { useState } from 'react';

const EditProfile = ({
  token,
  userData,
  toggleShowEditProfileElement,
  updateUserData,
}) => {
  const [firstName, setFirstName] = useState(userData.firstName);
  const [lastName, setLastName] = useState(userData.lastName);
  const [bio, setBio] = useState(userData.bio ? userData.bio : '');
  const [currentCity, setCurrentCity] = useState(
    userData.currentCity ? userData.currentCity : ''
  );
  const [homeTown, setHomeTown] = useState(
    userData.homeTown ? userData.homeTown : ''
  );
  const [err, setErr] = useState('');

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleBioChange = (event) => {
    setBio(event.target.value);
  };

  const handleCurrentCityChange = (event) => {
    setCurrentCity(event.target.value);
  };

  const handleHomeTownChange = (event) => {
    setHomeTown(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const reqBody = {
        firstName: firstName,
        lastName: lastName,
        bio: bio,
        currentCity: currentCity,
        homeTown: homeTown,
      };
      const res = await fetch(
        `${import.meta.env.VITE_SERVER}/api/user/me/patch`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reqBody),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        const err = data.msg;
        return setErr(err);
      }

      toggleShowEditProfileElement();
      updateUserData();
    } catch (err) {
      setErr(err);
    }
  };

  return (
    <div className="edit-profile">
      <div className="container">
        <div className="heading">
          <h2>Edit profile details</h2>
          <button onClick={toggleShowEditProfileElement}>&#x2715;</button>
        </div>
        <div className="sub-container">
          <form>
            <div>
              <label htmlFor="firstName">First name:</label>
              <input
                id="firstName"
                type="text"
                onChange={handleFirstNameChange}
                value={firstName}
              />
            </div>
            <div>
              <label htmlFor="lastName">Last name:</label>
              <input
                id="lastName"
                type="text"
                onChange={handleLastNameChange}
                value={lastName}
              />
            </div>
            <div>
              <label htmlFor="bio">Bio: </label>
              <textarea
                id="bio"
                onChange={handleBioChange}
                value={bio}
              ></textarea>
            </div>
            <div>
              <label htmlFor="currentCity">Current city/country</label>
              <input
                id="currentCity"
                onChange={handleCurrentCityChange}
                value={currentCity}
              />
            </div>
            <div>
              <label htmlFor="homeTown">Hometown:</label>
              <input
                id="homeTown"
                onChange={handleHomeTownChange}
                value={homeTown}
              />
            </div>
          </form>
        </div>
        <div className="save">
          <div>
            {err && <p>{err}</p>}
            <button
              className={firstName && lastName ? 'enabled' : 'disabled'}
              disabled={firstName && lastName ? false : true}
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

EditProfile.propTypes = {
  token: PropTypes.string,
  userData: PropTypes.object,
  toggleShowEditProfileElement: PropTypes.func,
  updateUserData: PropTypes.func,
};

export default EditProfile;
