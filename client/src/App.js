import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Login from './components/Login';
import Join from './components/Join'; // Join으로 변경
import Feed from './components/Feed';
import Register from './components/Register';
import MyPage from './components/MyPage';
import MusicSearch from './components/MusicSearch';

// import Menu from './components/Menu'; // Menu로 변경

import './App.css'; // styles 객체를 쓰지 않고 그냥 CSS 적용

import Sidebar from "./components/Sidebar/Sidebar";

// App.js
function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || location.pathname === '/join' || location.pathname === '/login';

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
        {!isAuthPage && <Sidebar />}
        <Box component="main" sx={{ flexGrow: 1, p: 0 }}> {/* padding 0으로 */}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/join" element={<Join />} />
            <Route path="/login" element={<Login />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/register" element={<Register />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/music" element={<MusicSearch />} />
          </Routes>
        </Box>
      </Box>
    </div>
  );
}


export default App;
