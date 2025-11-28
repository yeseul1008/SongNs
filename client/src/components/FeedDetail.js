import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography, Card, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useLocation, useNavigate } from "react-router-dom";

export default function MusicCard() {
  const location = useLocation();
  const { postId } = location.state || {};
  const navigate = useNavigate();

  const [sessionUserId, setSessionUserId] = useState(null); // 세션아이디
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]); // 댓글 state
  const [openCommentModal, setOpenCommentModal] = useState(false); // 모달 열림 상태
  const [newComment, setNewComment] = useState(""); // 입력값

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
  const goToOtherUser = () => { // 유저 프로필로 이동
    navigate("/otherUser", { state: { userId: post.USER_ID } });
  };
  // 상세 정보 가져오기
  const fnFeedDetail = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인 후 이용해주세요.");
      navigate("/");
      return;
    }
    try {
      const res = await fetch(`http://localhost:3010/feed/detail/${postId}`);
      const data = await res.json();
      console.log("상세정보:", data);
      if (res.ok) setPost(data.post);
    } catch (err) {
      console.error(err);
      alert("서버 오류");
    }
  };

  // 댓글 목록 가져오기
  const fnFeedComment = async () => {
    try {
      const res = await fetch(`http://localhost:3010/feed/comment/${postId}`);
      const data = await res.json();
      console.log("댓글 리스트:", data.list);
      if (res.ok || data.result === "success") setComments(data.list); // comments state 갱신
    } catch (err) {
      console.error(err);
      alert("서버 오류");
    }
  };

  const checkLikeStatus = async () => {
    if (!postId) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      const res = await fetch(`http://localhost:3010/feed/isLiked?userId=${userId}&postId=${postId}`);
      const data = await res.json();

      if (res.ok) setLiked(data.isLiked);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인 후 이용해주세요.");
      return;
    }
    const decoded = jwtDecode(token);
    try {
      const res = await fetch("http://localhost:3010/feed/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: decoded.userId, postId, cancel: liked }),
      });
      if (res.ok) setLiked(!liked);
    } catch (err) {
      console.error(err);
      alert("오류 발생");
    }
  };

  useEffect(() => {
    if (!postId) {
      alert("잘못된 접근입니다.");
      navigate("/");
      return;
    }
    fnFeedDetail();
    fnFeedComment(); // 댓글 목록 가져오기
  }, [postId]);

  useEffect(() => {
    checkLikeStatus();
  }, [postId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setSessionUserId(decoded.userId);
    }
  }, []);

  if (!post) return <Typography>로딩중...</Typography>;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        height: "90vh",
        gap: 4,
        padding: 4,
      }}
    >
      {/* 전체 카드 영역 */}
      <Card
        sx={{
          display: "flex",
          width: 830,
          height: 700,
          borderRadius: 7,
          padding: 3,
          border: "1px solid #000000",
          boxShadow: "0px 5px 3px rgba(0, 0, 0, 0.81)",
          gap: 3,
        }}
      >
        {/* 좌측 포스트 영역 */}
        <Box sx={{ flex: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {/* 카드 상단 */}
          {/* 카드 상단 */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
                  if (post.LASTFM_TRACK_ID) window.open(post.LASTFM_TRACK_ID, "_blank");
                }}
              />
              <Box>
                <Typography fontWeight="bold" fontSize={20}>{post.MUSIC_TITLE}</Typography>
                <Typography fontWeight="bold" fontSize={14}>{post.SINGER}</Typography>
              </Box>
            </Box>

            {/* 게시글 작성자이면 수정 버튼 표시 */}
            {/* 게시글 작성자이면 수정/삭제 버튼 표시 */}
            {sessionUserId === post.USER_ID && (
              <Box sx={{ display: "flex", gap: 1 }}>
                {/* 수정 버튼 */}
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate("/editPost", { state: { postId: post.POST_ID } })}
                  sx={{
                    borderRadius: 2,
                    border: "1px solid #000",
                    textTransform: "none",
                    fontWeight: "bold",
                    fontSize: 12,
                    color: "#000",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  수정
                </Button>

                {/* 삭제 버튼 */}
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: "bold",
                    fontSize: 12,
                    background: "#000000",
                    color: "#ffffff",
                    "&:hover": {
                      border: "#000000",
                      backgroundColor: "#757575ff",
                    },
                  }}
                  onClick={() => {
                    if (window.confirm("게시글을 삭제하시겠습니까?")) {
                      fetch(`http://localhost:3010/feed/postDelete/${post.POST_ID}`, {
                        method: "DELETE",
                        headers: {
                          "Authorization": "Bearer " + localStorage.getItem("token")
                        }
                      })
                        .then(res => res.json())
                        .then(data => {
                          if (data.result === "success") {
                            alert("삭제되었습니다");

                            navigate("/mypage");
                          } else {
                            alert(data.msg || "삭제 실패");
                          }
                        })
                        .catch(err => {
                          console.error(err);
                          alert("서버 오류");
                        });
                    }
                  }}

                >
                  삭제
                </Button>
              </Box>
            )}

          </Box>


          {/* 카드 이미지 */}
          <Box
            sx={{
              width: "100%",
              aspectRatio: "1 / 1",
              borderRadius: 2,
              overflow: "hidden",
              backgroundColor: "#f5f5f5",
            }}
          >
            <img
              src={encodeURI(post.IMAGE_URL)}
              alt={post.CONTENT}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>

          {/* 작성일 + 내용 */}
          <Typography fontSize={12}>{formatDate(post.CREATED_AT)}</Typography>
          <Typography sx={{ mb: 2 }}>{post.CONTENT}</Typography>
          <Box sx={{ borderBottom: "1px solid #ccc", mb: 2 }} />
          {/* 하단 좋아요 + 프로필 */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              onClick={handleLike}
            >
              <img
                src={liked ? "/afterLike.png" : "/Good.png"}
                alt="좋아요"
                style={{
                  width: 55, height: "auto", marginLeft: 10, transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.9)"}
                onMouseUp={(e) => e.currentTarget.style.transform = "scale(1.1)"}
              />
            </button>

            {/* 프로필 + 닉네임 */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Box
                sx={{
                  width: 87,
                  height: 87,
                  borderRadius: "50%",
                  backgroundColor: "black",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  transition: "transform 0.2s ease", // 애니메이션
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.9)"} // 클릭
                onMouseUp={(e) => e.currentTarget.style.transform = "scale(1.1)"}   // 클릭 후 복귀
              >
                <IconButton
                  sx={{
                    width: 83,
                    height: 83,
                    borderRadius: "50%",
                    padding: "3px",
                    background: "linear-gradient(to top, #97E646, #ffffff)",
                  }}
                  onClick={goToOtherUser}
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
                      src={post.PROFILE_IMG ? `http://localhost:3010${post.PROFILE_IMG}` : "/기본이미지.jpg"}
                      alt="유저 프로필"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Box>
                </IconButton>
              </Box>
              {/* 닉네임 */}
              <Typography fontSize={14} fontWeight="bold" sx={{ mt: 1 }}>
                {post.NICKNAME}
              </Typography>
            </Box>
          </Box>

        </Box>

        {/* 우측 댓글 영역 */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, padding: 2, borderLeft: "1px solid #ccc", overflowY: "auto" }}>
          <Typography fontWeight="bold" fontSize={18}>댓글</Typography>

          {comments.map((comment) => (
            <Box key={comment.COMMENT_ID} sx={{ display: "flex", gap: 1, alignItems: "flex-start", position: "relative" }}>
              <Box
                component="img"
                src={comment.PROFILE_IMG ? `http://localhost:3010${comment.PROFILE_IMG}` : "/기본이미지.jpg"}
                alt="댓글 프로필"
                sx={{ width: 40, height: 40, borderRadius: "50%" }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight="bold" fontSize={14}>{comment.NICKNAME}</Typography>
                <Typography fontSize={13}>{comment.COMMENT}</Typography>
                <Typography fontSize={11} color="gray">{formatDate(comment.CREATED_AT)}</Typography>
              </Box>

              {/* 삭제 버튼: 세션 유저와 댓글 작성자 일치 시 */}
              {/* 삭제 버튼: 세션 유저와 댓글 작성자 OR 게시글 작성자와 같으면 */}
              {sessionUserId === comment.USER_ID || sessionUserId === post.USER_ID ? (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    fontSize: 12,
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                  onClick={() => {
                    if (window.confirm("댓글을 삭제하시겠습니까?")) {
                      fetch("http://localhost:3010/user/commentDelete/" + comment.COMMENT_ID, {
                        method: "DELETE",
                        headers: { // 외부에서 공격 막음
                          "Authorization": "Bearer " + localStorage.getItem("token")
                        }
                      })
                        .then(res => res.json())
                        .then(data => {
                          alert("삭제되었습니다");
                          fnFeedComment()
                        })
                    }
                  }}
                >
                  삭제
                </Box>
              ) : null}

            </Box>
          ))}



          {/* 댓글 추가 버튼 */}
          <Box
            sx={{
              mt: 2,
              width: "100%",
              padding: 1.5,
              borderRadius: 2,
              border: "1px dashed #ccc",
              textAlign: "center",
              color: "#333",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
            onClick={() => setOpenCommentModal(true)}
          >
            + 댓글 추가
          </Box>

          {/* 댓글 입력 모달 */}
          <Dialog open={openCommentModal} onClose={() => setOpenCommentModal(false)} fullWidth maxWidth="sm">
            <DialogTitle>댓글 작성</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="댓글을 입력하세요"
                type="text"
                fullWidth
                multiline
                minRows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenCommentModal(false)}
                sx={{
                  color: "#000",
                  backgroundColor: "#fff",
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
              >
                취소
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  const token = localStorage.getItem("token");
                  if (!token) {
                    alert("로그인 후 이용해주세요.");
                    return;
                  }
                  const decoded = jwtDecode(token);
                  let param = { userId: decoded.userId, postId, content: newComment };
                  fetch("http://localhost:3010/feed/comment", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(param)
                  })
                    .then(res => res.json())
                    .then(data => {
                      alert("댓글 등록 완료!");
                      setNewComment("");
                      setOpenCommentModal(false);
                      fnFeedComment(); // 새 댓글 반영
                    })
                    .catch(err => {
                      console.error(err);
                      alert("댓글 등록 실패");
                    });
                }}
                sx={{
                  backgroundColor: "#000",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#333" },
                }}
              >
                등록
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Card>
    </Box>
  );
}
