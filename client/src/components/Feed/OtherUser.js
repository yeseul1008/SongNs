import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Avatar, Grid, Paper, ImageList, ImageListItem, Button } from '@mui/material';
import { jwtDecode } from "jwt-decode";
import { useLocation, useNavigate } from "react-router-dom";

function OtherUser() {
    const location = useLocation();
    const [user, setUser] = useState();
    const { userId } = location.state || {}; // MusicCard에서 보낸 userId
    const [feedList, setFeedList] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false); // 팔로우 상태
    const navigate = useNavigate();

    // 로그인한 유저 ID
    const token = localStorage.getItem("token");
    const loggedInUserId = token ? jwtDecode(token).userId : null;

    function fnGetUser() {
        if (!token) {
            alert("로그인 후 이용해주세요.");
            navigate("/");
            return;
        }

        fetch("http://localhost:3010/feed/profile/" + userId)
            .then(res => res.json())
            .then(data => {
                setUser({
                    USER_ID: data.user.USER_ID || '',
                    NICKNAME: data.user.NICKNAME || '',
                    EMAIL: data.user.EMAIL || '',
                    followers: data.user.followers || 0,
                    following: data.user.following || 0,
                    posts: data.user.posts || 0,
                    PROFILE_IMG: data.user.PROFILE_IMG
                        ? `http://localhost:3010${data.user.PROFILE_IMG}`
                        : null
                });

            });
    }

    function fnGetUserFeed() {
        if (!token) {
            alert("로그인 후 이용해주세요.");
            navigate("/");
            return;
        }

        fetch("http://localhost:3010/feed/feedList/" + userId)
            .then(res => res.json())
            .then(data => setFeedList(data.list));
    }

    // 팔로우 여부 체크
    function fnfollowCheck() {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        let param = {
            userId: decoded.userId,
            followUserId: userId
        };

        fetch("http://localhost:3010/feed/followCheck", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(param)
        })
            .then(res => res.json())
            .then(data => {
                // console.log("팔로우상태==>", data.isFollow);
                setIsFollowing(data.isFollow);
            })
    }

    // 팔로우/팔로잉수 확인
    function fnfollowCount() {
        let param = {
            userId: userId
        };

        fetch("http://localhost:3010/feed/followCount", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(param)
        })
            .then(res => res.json())
            .then(data => {
                setUser(prev => ({
                    ...prev,                     // 기존 user 정보 유지
                    following: data.following_cnt, // 팔로잉 수 업데이트
                    followers: data.follower_cnt   // 팔로워 수 업데이트
                }));
                console.log(user);
            })
    }

    useEffect(() => {
        fnGetUser();
        fnGetUserFeed();
        fnfollowCheck();
        fnfollowCount();
    }, []);

    return (
        <Container maxWidth="md">
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start" minHeight="100vh" sx={{ padding: '20px', marginTop: 3 }}>
                <Paper elevation={3} sx={{ padding: '20px', borderRadius: '15px', width: '100%', border: "1px solid #000000", boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.81)" }}>

                    {/* 프로필 정보 */}
                    <Box display="flex" flexDirection="column" alignItems="center" sx={{ marginBottom: 3 }}>
                        <Box
                            sx={{
                                width: 108, // 바깥 검정 테두리
                                height: 108,
                                borderRadius: "50%",
                                backgroundColor: "black",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginBottom: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 104,   // 안쪽 초록 테두리
                                    height: 104,
                                    borderRadius: "50%",
                                    background: "linear-gradient(to top, #97E646, #ffffff)",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: "5px", // 사진과 테두리 사이 여백
                                }}
                            >
                                <Box
                                    sx={{
                                        width: "100%",
                                        height: "100%",
                                        borderRadius: "50%",
                                        overflow: "hidden",
                                    }}
                                >
                                    <img
                                        src={user?.PROFILE_IMG ? user.PROFILE_IMG : "/기본이미지.jpg"}
                                        alt="프로필 이미지"
                                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                    />
                                </Box>
                            </Box>
                        </Box>

                        <Typography variant="h5">{user?.NICKNAME}</Typography>
                        <Typography variant="body2" color="text.secondary">@{user?.USER_ID}</Typography>

                        {/* 팔로우 버튼 (본인 계정이면 안보임) */}
                        {userId !== loggedInUserId && (
                            <Button
                                variant={isFollowing ? "outlined" : "contained"}
                                color="primary"
                                sx={{
                                    mt: 2,
                                    width: 200,
                                    borderRadius: '50px',
                                    boxShadow: 'none',
                                    textTransform: 'none',
                                    fontSize: '18px',
                                    fontWeight: 600,
                                    padding: '6px 0',

                                    // ===== 팔로잉 중일 때 (배경 흰색) =====
                                    ...(isFollowing
                                        ? {
                                            backgroundColor: "#ffffff",
                                            border: '2px solid #000',
                                            color: '#000',
                                            '&:hover': {
                                                backgroundColor: "#f5f5f5",
                                                boxShadow: 'none'
                                            }
                                        }
                                        :
                                        // ===== 팔로잉이 아닐 때 (원래 CSS 그대로) =====
                                        {
                                            backgroundColor: 'transparent',
                                            border: '2px solid #000',
                                            borderRadius: '50px',
                                            boxShadow: 'none',
                                            background: "linear-gradient(to bottom, #ffffff 0%, #97E646 100%)",
                                            textTransform: 'none',
                                            fontSize: '18px',
                                            fontWeight: 600,
                                            color: '#000',
                                            padding: '6px 0',
                                            '&:hover': {
                                                background: "linear-gradient(to bottom, #ffffff 0%, #b6f264 100%)",
                                                boxShadow: 'none',
                                            },
                                        }
                                    ),
                                }}
                                onClick={() => {
                                    if (!isFollowing) { // 팔로잉 되있지 않은 경우 (인서트)
                                        const token = localStorage.getItem("token");
                                        const decoded = jwtDecode(token);
                                        let param = {
                                            userId: decoded.userId,
                                            followUserId: userId
                                        };
                                        console.log(param);

                                        fetch("http://localhost:3010/feed/follow", {
                                            method: "POST",
                                            headers: {
                                                "Content-type": "application/json"
                                            },
                                            body: JSON.stringify(param)
                                        })
                                            .then(res => res.json())
                                            .then(data => {
                                                console.log(data);
                                                alert(data.msg);
                                                setIsFollowing(true);
                                                fnfollowCount();
                                            })
                                    } else { // 팔로잉 되있는 경우 (딜리트)
                                        const token = localStorage.getItem("token");
                                        const decoded = jwtDecode(token);
                                        let param = {
                                            userId: decoded.userId,
                                            followUserId: userId
                                        };
                                        console.log(param);

                                        fetch("http://localhost:3010/feed/followDelete", {
                                            method: "POST",
                                            headers: {
                                                "Content-type": "application/json"
                                            },
                                            body: JSON.stringify(param)
                                        })
                                            .then(res => res.json())
                                            .then(data => {
                                                console.log(data);
                                                alert(data.msg);
                                                setIsFollowing(false);
                                                fnfollowCount();
                                            })
                                    }
                                }}
                            >
                                {isFollowing ? "following" : "follow"}
                            </Button>
                        )}
                    </Box>

                    <Grid container spacing={2} sx={{ marginTop: 2 }}>
                        <Grid item xs={4} textAlign="center">
                            <Typography variant="h6">팔로워</Typography>
                            <Typography variant="body1">{user?.followers}</Typography>
                        </Grid>
                        <Grid item xs={4} textAlign="center">
                            <Typography variant="h6">팔로잉</Typography>
                            <Typography variant="body1">{user?.following}</Typography>
                        </Grid>
                        <Grid item xs={4} textAlign="center">
                            <Typography variant="h6">게시물</Typography>
                            <Typography variant="body1">{user?.posts}</Typography>
                        </Grid>
                    </Grid>

                    {/* 게시글 이미지 */}
                    <Box sx={{ marginTop: 4 }}>
                        <Typography variant="h6" sx={{ marginBottom: 2 }}>내 게시글</Typography>
                        <ImageList variant="standard" cols={3} gap={8}>
                            {feedList.map(feed => feed.IMAGE_URL && (
                                <ImageListItem
                                    key={feed.POST_ID}
                                    sx={{
                                        width: '100%',
                                        aspectRatio: '1 / 1',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'border 0.2s ease-in-out', // 부드럽게
                                        '&:hover': {
                                            border: '2px solid #97E646', // 원하는 색상
                                        }
                                    }}
                                >
                                    <img
                                        src={feed.IMAGE_URL}
                                        alt={feed.CONTENT || 'feed image'}
                                        loading="lazy"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            display: 'block',
                                        }}
                                        onClick={() => navigate("/feedDetail", { state: { postId: feed.POST_ID } })}
                                    />
                                </ImageListItem>

                            ))}
                        </ImageList>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}

export default OtherUser;
