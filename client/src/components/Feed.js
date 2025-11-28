import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography, Card } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function Feed() {
  const [posts, setPosts] = useState([]); // 랜덤으로 배치된 게시글 배열
  const [currentIndex, setCurrentIndex] = useState(0);
  const [postId, setPostId] = useState(null); // 현재 포스트 아이디 저장
  const [otheruserId, setUserId] = useState(null); // 현재 포스트 유저 아이디 저장
  const [liked, setLiked] = useState(false); // 좋아요 여부
  const navigate = useNavigate();

  const currentPost = posts[currentIndex];

  const goToFeedDetail = () => {
    if (postId) navigate("/feedDetail", { state: { postId } });
  };

  const goToOtherUser = () => {
    if (otheruserId) navigate("/otherUser", { state: { userId: otheruserId } });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "...";
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd} / ${hh}:${min}`;
  };

// 오른쪽 버튼 클릭
const handleNext = () => {
  setCurrentIndex((prev) => (prev < posts.length - 1 ? prev + 1 : 0));
};

// 왼쪽 버튼 클릭
const handlePrev = () => {
  setCurrentIndex((prev) => (prev > 0 ? prev - 1 : posts.length - 1));
};


  // 전체 랜덤 게시글 가져오기
  const fetchRandomPosts = async () => {
    try {
      const res = await fetch("http://localhost:3010/feed/randomAll"); // 백엔드에서 전체 랜덤 게시글 배열 반환
      const data = await res.json();
      setPosts(data.posts);
      setCurrentIndex(0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRandomPosts();
  }, []);

  // 현재 포스트가 바뀔 때 postId, userId 업데이트
  useEffect(() => {
    if (currentPost) {
      setPostId(currentPost.POST_ID);
      setUserId(currentPost.USER_ID);
    }
  }, [currentPost]);

  // 좋아요 여부 확인
  const checkLikeStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      if (!postId) return;

      const res = await fetch(
        `http://localhost:3010/feed/isLiked?userId=${userId}&postId=${postId}`
      );
      const data = await res.json();

      if (res.ok) {
        setLiked(data.isLiked);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (postId) {
      checkLikeStatus();
    }
  }, [postId]);

  // 좋아요 토글
  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인 후 이용해주세요.");
        return;
      }
      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      const res = await fetch("http://localhost:3010/feed/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          postId,
          cancel: liked,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setLiked(!liked);
        alert(liked ? "좋아요 취소 완료!" : "좋아요 완료!");
      } else {
        alert("좋아요 실패: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("오류 발생");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        gap: 4,
      }}
    >
      {/* 왼쪽 화살표 */}
      <Box
        sx={{
          width: 90,
          height: 90,
          borderRadius: "50%",
          overflow: "hidden",
          boxShadow: "0px 5px 3px rgba(0, 0, 0, 0.81)",
          cursor: "pointer",
          marginRight: 5,
          transition: "transform 0.2s ease",
          "&:hover": { transform: "scale(1.06)" },
          "&:active": { transform: "scale(0.9)" },
        }}
        onClick={handlePrev}
      >
        <Box
          component="img"
          src="/Left.png"
          alt="왼쪽 화살표"
          sx={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }}
        />
      </Box>

      {/* 카드 */}
      <Card
        sx={{
          marginTop: 12,
          width: 500,
          height: 700,
          borderRadius: 7,
          padding: 3,
          paddingLeft: 5,
          paddingRight: 5,
          border: "1px solid #000000",
          boxShadow: "0px 5px 3px rgba(0, 0, 0, 0.81)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* 카드 상단 */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              component="img"
              src="/ummban.png"
              alt="앨범 이미지"
              sx={{
                width: 50,
                height: 50,
                borderRadius: 2,
                cursor: "pointer",
                transition: "transform 0.5s ease",
                "&:hover": { transform: "rotate(360deg)" },
              }}
              onClick={() => {
                if (currentPost?.LASTFM_TRACK_ID) {
                  window.open(currentPost.LASTFM_TRACK_ID, "_blank");
                }
              }}
            />
            <Box>
              <Typography fontWeight="bold" fontSize={20}>
                {currentPost?.MUSIC_TITLE || "노래 제목"}
              </Typography>
              <Typography fontWeight="bold" fontSize={14}>
                {currentPost?.SINGER || "가수 이름"}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* 카드 이미지 */}
        <Box
          sx={{
            width: "100%",
            aspectRatio: "1 / 1",
            borderRadius: 2,
            overflow: "hidden",
            backgroundColor: "#f5f5f5",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {currentPost?.IMAGE_URL &&
          currentPost.IMAGE_URL.toLowerCase().endsWith(".gif") ? (
            <img
              src={encodeURI(currentPost.IMAGE_URL)}
              alt={currentPost.CONTENT || "feed image"}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                backgroundImage: `url(${encodeURI(currentPost?.IMAGE_URL)})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          )}
        </Box>

        {/* 게시글 내용 */}
        <Typography fontSize={12}>{formatDate(currentPost?.CREATED_AT)}</Typography>
        <Typography
          fontSize={13}
          sx={{
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {currentPost?.CONTENT}
        </Typography>

        {/* 카드 하단 아이콘 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* 좋아요 */}
          <button
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, outline: "none" }}
            onClick={handleLike}
          >
            <img
              src={liked ? "/afterLike.png" : "/Good.png"}
              alt="좋아요"
              style={{
                width: 55,
                height: "auto",
                marginLeft: 10,
                marginBottom: 2,
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.9)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            />
          </button>

          {/* 프로필 */}
          <Box
            sx={{
              width: 87,
              height: 87,
              borderRadius: "50%",
              backgroundColor: "black",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transition: "transform 0.2s ease",
            }}
            onClick={goToOtherUser}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.9)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          >
            <IconButton
              sx={{
                width: 83,
                height: 83,
                borderRadius: "50%",
                padding: "3px",
                background: "linear-gradient(to top, #97E646, #ffffff)",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  overflow: "hidden",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={currentPost?.PROFILE_IMG ? `http://localhost:3010${currentPost.PROFILE_IMG}` : "/기본이미지.jpg"}
                  alt="유저 프로필"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </Box>
            </IconButton>
          </Box>

          {/* 댓글 */}
          <button
            style={{ background: "none", border: "none", cursor: "pointer" }}
            onClick={goToFeedDetail}
          >
            <img
              src="/comment.png"
              alt="댓글"
              style={{ width: 65, height: "auto", marginRight: 10, transition: "transform 0.2s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.9)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            />
          </button>
        </div>
      </Card>

      {/* 오른쪽 화살표 */}
      <Box
        sx={{
          width: 90,
          height: 90,
          borderRadius: "50%",
          overflow: "hidden",
          boxShadow: "0px 5px 3px rgba(0, 0, 0, 0.81)",
          cursor: "pointer",
          marginLeft: 5,
          transition: "transform 0.2s ease",
          "&:hover": { transform: "scale(1.06)" },
          "&:active": { transform: "scale(0.9)" },
        }}
        onClick={handleNext}
      >
        <Box
          component="img"
          src="/Right.png"
          alt="오른쪽 화살표"
          sx={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }}
        />
      </Box>
    </Box>
  );
}
export default Feed;