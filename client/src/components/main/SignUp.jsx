import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AvatarEditor from 'react-avatar-editor';
import signedUpPicture from '../../assets/successful-sign-up.jpg';

const SignUp = ({ token }) => {
  const navigate = useNavigate();
  const [err, setErr] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [homeTown, setHomeTown] = useState('');
  const [successfullySignedUp, setSuccessfullySignedUp] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const res = await fetch(`${import.meta.env.VITE_SERVER}/api`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        return navigate('/');
      }
    };
    checkToken();
  }, [navigate, token]);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };
  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  // Avatar
  const [image, setImage] = useState(null);
  const editor = useRef(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const saveAvatarFile = async () => {
    if (!editor) {
      return;
    }
    try {
      const canvasScaled = editor.current.getImage();
      const canvasURL = canvasScaled.toDataURL('image/webp');
      const res = await fetch(canvasURL);
      if (!res.ok) {
        throw new Error('Failed to fetch image data.');
      }
      const blob = await res.blob();
      const fileExt = image.name.split('.').slice(-1).toString();

      const file = new File([blob], `avatar.${fileExt}`, {
        type: `image/${fileExt}`,
      });
      setAvatarFile(file);
    } catch (err) {
      console.log();
    }
  };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
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
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('confirmPassword', confirmPassword);
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);

      if (avatarFile) {
        formData.append('avatarFile', avatarFile);
      }
      if (currentCity) {
        formData.append('currentCity', currentCity);
      }
      if (homeTown) {
        formData.append('homeTown', homeTown);
      }

      const res = await fetch(`${import.meta.env.VITE_SERVER}/signup`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        setCurrentStep(errData.step);
        return setErr(errData);
      }

      setSuccessfullySignedUp(true);
      setTimeout(() => {
        setSuccessfullySignedUp(false);
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  if (successfullySignedUp) {
    return (
      <div className="sign-up">
        <h1>You successfully signed up</h1>
        <img src={signedUpPicture} alt="successful-sign-up.jpg" />
        <h4 className="redirecting-message">
          Redirecting to the log in page...
        </h4>
      </div>
    );
  }

  if (currentStep === 1) {
    return (
      <div className="sign-up">
        <h1>Create a profile</h1>
        <h2>Your friends are waiting for you</h2>
        {err && err.step === 1 ? <h3>{err.msg}</h3> : null}
        <form autoComplete="off" onSubmit={handleSubmit}>
          <div className="field">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6M12,13C14.67,13 20,14.33 20,17V20H4V17C4,14.33 9.33,13 12,13M12,14.9C9.03,14.9 5.9,16.36 5.9,17V18.1H18.1V17C18.1,16.36 14.97,14.9 12,14.9Z" />
            </svg>
            <input
              type="text"
              onChange={handleUsernameChange}
              value={username}
              placeholder="Create username"
              autoComplete="new-username"
            />
          </div>
          <div className="field">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <title>lock-outline</title>
              <path d="M12,17C10.89,17 10,16.1 10,15C10,13.89 10.89,13 12,13A2,2 0 0,1 14,15A2,2 0 0,1 12,17M18,20V10H6V20H18M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V10C4,8.89 4.89,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
            </svg>
            <input
              type={showPassword ? 'text' : 'password'}
              onChange={handlePasswordChange}
              value={password}
              placeholder="Create password"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="show-password-button"
              onClick={toggleShowPassword}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <div className="field">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <title>lock-check-outline</title>
              <path d="M14 15C14 16.11 13.11 17 12 17C10.89 17 10 16.1 10 15C10 13.89 10.89 13 12 13C13.11 13 14 13.9 14 15M13.09 20C13.21 20.72 13.46 21.39 13.81 22H6C4.89 22 4 21.1 4 20V10C4 8.89 4.89 8 6 8H7V6C7 3.24 9.24 1 12 1S17 3.24 17 6V8H18C19.11 8 20 8.9 20 10V13.09C19.67 13.04 19.34 13 19 13C18.66 13 18.33 13.04 18 13.09V10H6V20H13.09M9 8H15V6C15 4.34 13.66 3 12 3S9 4.34 9 6V8M21.34 15.84L17.75 19.43L16.16 17.84L15 19L17.75 22L22.5 17.25L21.34 15.84Z" />
            </svg>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              onChange={handleConfirmPasswordChange}
              value={confirmPassword}
              placeholder="Confirm password"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="show-password-button"
              onClick={toggleShowConfirmPassword}
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button
            type="button"
            className={
              username && password && confirmPassword ? 'enabled' : 'disabled'
            }
            onClick={handleNextStep}
            disabled={username && password && confirmPassword ? false : true}
          >
            Next step
          </button>
        </form>
        <p className="current-step">Step {currentStep} of 3</p>
        <p>
          Already have a profile?{' '}
          <Link className="log-in-link" to="/login">
            Log in
          </Link>
        </p>
      </div>
    );
  }
  if (currentStep === 2) {
    return (
      <div className="sign-up">
        <h1>Add a picture</h1>

        {image && (
          <div className="avatar">
            <AvatarEditor
              ref={editor}
              image={image}
              width={200}
              height={200}
              border={30}
              borderRadius={200}
              color={[255, 255, 255, 0.6]} // RGBA
              scale={1.2}
              rotate={0}
            />
          </div>
        )}
        <label htmlFor="upload-picture">
          {image ? 'Choose another file...' : 'Choose a file...'}
        </label>
        <input
          type="file"
          id="upload-picture"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleImageUpload}
        />
        <div className="buttons">
          <button
            type="button"
            className="previous-step-button"
            onClick={handlePreviousStep}
          >
            Previous step
          </button>
          <button
            type="button"
            className="enabled"
            onClick={() => {
              saveAvatarFile();
              handleNextStep();
            }}
          >
            {image ? 'Next step' : 'Skip'}
          </button>
        </div>

        <p className="current-step">Step {currentStep} of 3</p>
      </div>
    );
  }
  if (currentStep === 3) {
    return (
      <div className="sign-up">
        <h1>Add personal details</h1>
        {err && err.step === 3 ? <h3>{err.msg}</h3> : null}
        <form autoComplete="off" onSubmit={handleSubmit}>
          <div className="field">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <title>account-edit</title>
              <path d="M21.7,13.35L20.7,14.35L18.65,12.3L19.65,11.3C19.86,11.09 20.21,11.09 20.42,11.3L21.7,12.58C21.91,12.79 21.91,13.14 21.7,13.35M12,18.94L18.06,12.88L20.11,14.93L14.06,21H12V18.94M12,14C7.58,14 4,15.79 4,18V20H10V18.11L14,14.11C13.34,14.03 12.67,14 12,14M12,4A4,4 0 0,0 8,8A4,4 0 0,0 12,12A4,4 0 0,0 16,8A4,4 0 0,0 12,4Z" />
            </svg>
            <input
              type="text"
              onChange={handleFirstNameChange}
              value={firstName}
              placeholder="Enter first name"
              maxLength={55}
              autoComplete="new-first-name"
            />
          </div>
          <div className="field">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <title>account-edit</title>
              <path d="M21.7,13.35L20.7,14.35L18.65,12.3L19.65,11.3C19.86,11.09 20.21,11.09 20.42,11.3L21.7,12.58C21.91,12.79 21.91,13.14 21.7,13.35M12,18.94L18.06,12.88L20.11,14.93L14.06,21H12V18.94M12,14C7.58,14 4,15.79 4,18V20H10V18.11L14,14.11C13.34,14.03 12.67,14 12,14M12,4A4,4 0 0,0 8,8A4,4 0 0,0 12,12A4,4 0 0,0 16,8A4,4 0 0,0 12,4Z" />
            </svg>
            <input
              type="text"
              onChange={handleLastNameChange}
              value={lastName}
              placeholder="Enter last name"
              maxLength={55}
              autoComplete="new-last-name"
            />
          </div>
          <div className="field">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <title>map-marker-outline</title>
              <path d="M12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,10 7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4Z" />
            </svg>
            <input
              type="text"
              onChange={handleCurrentCityChange}
              value={currentCity}
              placeholder="Enter current city and country (optional)"
              maxLength={55}
              autoComplete="new-current-city"
            />
          </div>
          <div className="field">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <title>home-outline</title>
              <path d="M12 5.69L17 10.19V18H15V12H9V18H7V10.19L12 5.69M12 3L2 12H5V20H11V14H13V20H19V12H22" />
            </svg>
            <input
              type="text"
              onChange={handleHomeTownChange}
              value={homeTown}
              placeholder="Enter hometown (optional)"
              maxLength={55}
              autoComplete="new-hometown"
            />
          </div>

          <div className="buttons">
            <button
              type="button"
              className="previous-step-button"
              onClick={handlePreviousStep}
            >
              Previous step
            </button>
            <button
              type="button"
              className={firstName && lastName ? 'enabled' : 'disabled'}
              onClick={(event) => {
                handleSubmit(event);
              }}
              disabled={firstName && lastName ? false : true}
            >
              Create a profile
            </button>
          </div>
        </form>
        <p className="current-step">Step {currentStep} of 3</p>
      </div>
    );
  }
};

SignUp.propTypes = {
  token: PropTypes.string,
};

export default SignUp;
