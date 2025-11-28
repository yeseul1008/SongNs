import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Login from './components/Login';
import Join from './components/Join';
import FindId from './components/FindId';
import FindPwd from './components/FindPwd';
import Feed from './components/Feed';
import FeedDetail from './components/FeedDetail';
import EditPost from './components/EditPost';

import Search from './components/Search';

import MyPage from './components/Feed/MyPage';
import OtherUser from './components/Feed/OtherUser';
import Register from './components/Feed/Register';
import UserEdit from './components/Feed/UserEdit';
import LikeList from './components/Feed/LikeList';
import Friend from './components/Feed/Friend';
import Option from './components/Feed/Option';
import SearchList from './components/Feed/SearchList';

import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import Alert from "./components/Header/Alert";

import './App.css';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/'
    || location.pathname === '/join'
    || location.pathname === '/login'
    || location.pathname === '/findId'
    || location.pathname === '/findPwd';

  return (
    <div
      className="app"
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundImage: "url('/snsBG.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />

        {/* Sidebar는 기존처럼 */}
        {!isAuthPage && <Sidebar />}
        {!isAuthPage && <Alert />}

        <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
          {/* Header도 항상 보이되, AuthPage에서는 숨김 */}
          {!isAuthPage && <Header />}

          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/join" element={<Join />} />
            <Route path="/login" element={<Login />} />
            <Route path="/findId" element={<FindId />} />
            <Route path="/findPwd" element={<FindPwd />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/editPost" element={<EditPost />} />
            <Route path="/feedDetail" element={<FeedDetail />} />
            <Route path="/register" element={<Register />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/otherUser" element={<OtherUser />} />
            <Route path="/userEdit" element={<UserEdit />} />
            <Route path="/searchList" element={<SearchList />} />
            <Route path="/likeList" element={<LikeList />} />
            <Route path="/friend" element={<Friend />} />
            <Route path="/option" element={<Option />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </Box>
      </Box>
    </div>
  );
}

export default App;
