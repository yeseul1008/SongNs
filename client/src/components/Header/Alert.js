import React, { useEffect, useState } from "react";
import { Box, Button, Paper, Typography, IconButton, Badge } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const notificationsMock = [
  { id: 1, content: "user02님이 댓글을 남겼습니다." },
  { id: 2, content: "user03님이 댓글을 남겼습니다." },
];


function Alert() {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  // 댓글 불러오기
  function fnGetComment() {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode(token);

      fetch("http://localhost:3010/user/commentList/" + decoded.userId)
        .then(res => res.json())
        .then(data => {
          console.log("유저가 받은 댓글:", data.list);
          setComments(data.list);   // ← 댓글 리스트 저장
        })
        .catch(err => console.error(err));
    }
  }

  useEffect(() => {
    fnGetComment();
  }, []);


  const handleToggle = () => {
    setOpen(!open);
  };
  return <>
    {/* 알람 버튼 - 오른쪽 아래 */}
    <Box
      sx={{
        position: "fixed",
        bottom: 30,
        right: 30,
        zIndex: 1500,
      }}
    >
      <Badge
        badgeContent={comments.filter(c => c.IS_READ === 'N').length}
        color="error"
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleToggle}
          sx={{
            borderRadius: "50%",
            minWidth: 60,
            minHeight: 60,
            border: "2px solid #000000",
            boxShadow: "0px 5px 10px rgba(0,0,0,0.3)",
            background: "linear-gradient(to bottom, #ffffff 0%, #97E646 100%)",
            "&:hover": {
              background: "linear-gradient(to bottom, #ffffff 0%, #b6f264 100%)",
            },
          }}
        >
          <NotificationsIcon sx={{ fontSize: 30, color: "#000" }} />
        </Button>
      </Badge>
    </Box>

    {/* 백드롭 */}
    {open && (
      <Box
        onClick={handleToggle}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1400,
        }}
      />
    )}

    {/* 알림 창 */}
    <Paper
      sx={{
        position: "fixed",
        top: 0,
        right: 0,
        width: 300,
        height: "100vh",
        padding: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        backgroundColor: "#ffffff",
        zIndex: 1501,
        boxShadow: "-5px 0px 15px rgba(0,0,0,0.3)",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s ease-in-out",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">알림</Typography>
        <IconButton onClick={handleToggle}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {comments.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            새로운 알림이 없습니다.
          </Typography>
        ) : (
          comments.map((comment) => (
            <Paper
              key={comment.COMMENT_ID}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                padding: 1,
                marginBottom: 1,
                border: "1px solid #ccc",
                backgroundColor: comment.IS_READ === 'N' ? "#ffffff" : "#f0f0f0",
                opacity: comment.IS_READ === 'N' ? 1 : 0.6,
                "&:hover": { border: "1px solid #000000", },
              }}
              onClick={() => {
                // 1. 댓글 읽음 처리
                let param = {
                  commentId: comment.COMMENT_ID
                };

                fetch("http://localhost:3010/user/commentRead/", {
                  method: "POST",
                  headers: {
                    "Content-type": "application/json"
                  },
                  body: JSON.stringify(param)
                })
                  .then(res => res.json())
                  .then(data => {
                    fnGetComment();          // 댓글 리스트 업데이트
                    setOpen(false);          // 알림창 닫기
                    navigate("/feedDetail", { state: { postId: comment.POST_ID } });
                  })
              }}
            >
              {/* 프로필 사진 */}
              <Box
                component="img"
                src={comment.PROFILE_IMG ? `http://localhost:3010${comment.PROFILE_IMG}` : "/기본이미지.jpg"}
                alt="댓글 프로필"
                sx={{ width: 40, height: 40, borderRadius: "50%" }}
              />
              {/* 댓글 내용 */}
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" fontWeight="bold">
                  {comment.NICKNAME}님이 댓글을 남겼습니다.
                </Typography>
                <Typography variant="body2">{comment.COMMENT}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(comment.CREATED_AT).toLocaleString()}
                </Typography>
              </Box>
            </Paper>
          ))
        )}
      </Box>


    </Paper>

  </>
}

export default Alert; 