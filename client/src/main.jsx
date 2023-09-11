import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.css';
import './styles/header/header.css';
import './styles/header/searchResults.css';
import './styles/main/login.css';
import './styles/main/signup.css';
import './styles/main/home.css';
import './styles/main/sidebarMenu.css';
import './styles/main/newPost.css';
import './styles/main/post.css';
import './styles/main/comment.css';
import './styles/main/allComments.css';
import './styles/main/friend.css';
import './styles/main/sharePost.css';
import './styles/main/profile.css';
import './styles/main/intro.css';
import './styles/main/profilePreview.css';
import './styles/main/editProfile.css';
import './styles/main/friends.css';
import './styles/main/friendRequests.css';
import './styles/main/friendRequest.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
