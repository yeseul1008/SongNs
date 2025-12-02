import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Box, TextField, Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom"; // 추가

import SearchIcon from "@mui/icons-material/Search"; // 검색 아이콘
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

export default function Header() {
  const [search, setSearch] = useState("");

  const navigate = useNavigate(); // 훅 사용

  const goToLogin = () => {
    navigate("/login"); // /login 페이지로 이동
  };

  // 노래검색
  const handleSearch = async () => {
    if (!search) return;
    navigate("/search", { state: { query: search } });
    try {
      const response = await fetch(`http://localhost:3010/api/search?q=${search}`);
      const data = await response.json();

      const tracks = data.results.trackmatches.track; // 검색 결과 배열
      // console.log("검색 결과:", tracks);

      // 여기서 원하는 페이지로 이동하거나, state에 저장해서 렌더링 가능
      // 예시: searchResults state에 저장
    } catch (err) {
      console.error("검색 실패:", err);
    }
  };
  // 로그인/로그아웃
  const goToLoginOrLogout = () => {
    const token = localStorage.getItem("token");

    if (token) {
      // 로그인 상태 → 로그아웃 확인
      const confirmLogout = window.confirm("로그아웃 하시겠습니까?");
      if (confirmLogout) {
        localStorage.removeItem("token"); // 토큰 삭제
        alert("로그아웃 되었습니다.");
        navigate("/login"); // 로그인 페이지 이동
      }
    } else {
      // 로그인 안 되어 있음 → 로그인 페이지로 이동
      navigate("/login");
    }
  };


  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(to bottom, #ffffff 0%, #97E646 100%)",
        // paddingX: 1,
      }}
    >
      <Toolbar sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* 왼쪽 로고 */}
        <Box
          component="img"
          src="/snsLogo.png"
          sx={{
            height: 50, // 로고 높이 조절
            cursor: "pointer",
          }}
          onClick={() => navigate("/feed")}
        />


        {/* 검색창 */}
        <Box sx={{ display: "flex", flex: 1, maxWidth: 500 }}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Search songs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            sx={{
              marginRight: 2,
              height: 45,
              width: 400,
              border: "1px solid #000000",
              background: "linear-gradient(to bottom, #ffffff 0%, #dfdfdfff 100%)",
              borderRadius: "50px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "50px",
                height: 45,
                "& fieldset": {
                  borderColor: "#000000",
                  borderWidth: "1px",
                },
                "&:hover fieldset": {
                  borderColor: "#555555",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#888888",
                  borderWidth: "1px",
                },
              },
            }}
          />

          {/* 원형 버튼 (아이콘 없어도 됨) */}
          < IconButton
            onClick={handleSearch}
            sx={{
              border: "1px solid #000000",
              width: 45,
              height: 45,
              borderRadius: "50%",
              background: "linear-gradient(to bottom, #ffffff 0%, #FEFF66 100%)"

            }}
          >
            <SearchIcon sx={{ color: "#000000" }} /> {/* 아이콘 색상 검정 */}
          </IconButton>
        </Box>

        {/* 로그인 / 로그아웃 버튼 */}
        <IconButton
          onClick={goToLoginOrLogout}
          sx={{
            border: "1px solid #000000",
            width: 45,
            height: 45,
            borderRadius: "50%",
            background: "linear-gradient(to bottom, #ffffff 0%, #FEFF66 100%)",
            marginLeft: "auto"
          }}
        >
          <PersonOutlineIcon sx={{ color: "#000000", fontSize: 30 }} />
        </IconButton>

      </Toolbar>
    </AppBar>
  );
}
