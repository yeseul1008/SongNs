import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Login from './components/Login';
import Join from './components/Join';
import FindId from './components/FindId';
import FindPwd from './components/FindPwd';
import Feed from './components/Feed';
import FeedDetail from './components/FeedDetail';
import EditPost from './components/EditPost';
import ChatPopup from './components/ChatPopup';

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
import AlertChat from "./components/Header/AlertChat";

import './App.css';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/'
    || location.pathname === '/join'
    || location.pathname === '/login'
    || location.pathname === '/findId'
    || location.pathname === '/findPwd';

  // 채팅 관련 상태
  const [chatList, setChatList] = useState([]); // 현재 열려있는 채팅방 목록 [{userId, nickname, chatRoomId}]

  // 채팅방 열기
  const openChat = (userId, nickname, chatRoomId) => {
    if (!chatList.some(chat => chat.userId === userId)) {
      setChatList(prev => [...prev, { userId, nickname, chatRoomId }]);
    }
  };

  // 채팅방 닫기
  const closeChat = (userId) => {
    setChatList(prev => prev.filter(chat => chat.userId !== userId));
  };

  // window 이벤트로 채팅 열기
  useEffect(() => {
    const handler = (e) => {
      const { userId, nickname, chatRoomId } = e.detail;
      openChat(userId, nickname, chatRoomId);
    };
    window.addEventListener('openChat', handler);
    return () => window.removeEventListener('openChat', handler);
  }, []);

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

        {/* Sidebar와 Alert */}
        {!isAuthPage && <Sidebar />}
        {!isAuthPage && <Alert />}
        {!isAuthPage && <AlertChat />}

        <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
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

      {/* 최상단 고정 채팅 팝업 렌더 */}
      {chatList.map(chat => (
        <ChatPopup
          key={chat.userId}
          chatRoomId={chat.chatRoomId}  // chatRoomId 전달
          otherUserId={chat.userId}
          otherUserNickname={chat.nickname}
          onClose={() => closeChat(chat.userId)}
        />
      ))}
    </div>
  );
}

export default App;
