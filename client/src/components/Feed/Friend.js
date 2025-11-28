import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { Box, Card, Typography } from '@mui/material';
import { useLocation, useNavigate } from "react-router-dom";

function Friend() {
    const [followList, setFollowList] = useState([]);
    const [followerList, setFollowerList] = useState([]);
    const navigate = useNavigate();

    const goToOtherUser = (user) => {
        navigate("/otherUser", { state: { userId: user.USER_ID } });
    };


    // 내가 팔로우한 리스트
    const fnFollowList = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            try {
                const res = await fetch("http://localhost:3010/feed/followList/" + decoded.userId);
                const data = await res.json();
                setFollowList(data.list);
            } catch (err) {
                console.error(err);
            }
        } else {
            alert("로그인 후 이용해주세요.");
            navigate("/");
        }
    };

    // 나를 팔로우한 리스트
    const fnFollowerList = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            try {
                const res = await fetch("http://localhost:3010/feed/followLister/" + decoded.userId);
                const data = await res.json();
                setFollowerList(data.list);
            } catch (err) {
                console.error(err);
            }
        } else {

        }
    };

    useEffect(() => {
        fnFollowList();
        fnFollowerList();
    }, []);

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                minHeight: '80vh',
                padding: 2,
                gap: 3,
                marginTop: 2,
            }}
        >
            {/* 전체 박스 */}
            <Box
                sx={{
                    display: 'flex',
                    width: '90%',
                    backgroundColor: '#ffffff',
                    border: '1px solid #000000ff',
                    borderRadius: 5,
                    boxShadow: "0px 5px 3px rgba(0, 0, 0, 0.81)",
                    padding: 3,
                    gap: 3,
                    marginTop: 4,
                    marginLeft: 50,
                    marginRight: 50
                }}
            >
                {/* 왼쪽: 내가 팔로우한 리스트 */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1 , textAlign: 'center'}}>
                        내가 팔로우한 사람 ({followList.length})
                    </Typography>
                    {followList.map((user) => (
                        <Card
                            key={user.USER_ID}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: 1.5,
                                border: '1px solid #000000ff',
                                borderRadius: 5,
                                boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.81)",
                                transition: 'transform 0.2s ease',
                                "&:hover": { transform: "scale(1.02)" },
                            }}
                            onClick={() => goToOtherUser(user)}
                        >
                            <Box sx={{ width: 50, height: 50, borderRadius: "50%", overflow: "hidden", mr: 2 }}>
                                <img
                                    src={user.PROFILE_IMG ? `http://localhost:3010${user.PROFILE_IMG}` : "/기본이미지.jpg"}
                                    alt={user.NICKNAME}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </Box>
                            <Box>
                                <Typography fontWeight="bold">{user.NICKNAME}</Typography>
                                <Typography color="text.secondary" fontSize={12}>
                                    @{user.USER_ID}
                                </Typography>
                            </Box>
                        </Card>
                    ))}
                </Box>

                {/* 구분선 */}
                <Box sx={{ width: '0.8px', backgroundColor: '#000000ff' }} />

                {/* 오른쪽: 나를 팔로우한 리스트 */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1 ,textAlign: 'center'}}>
                        나를 팔로우한 사람 ({followerList.length})
                    </Typography>
                    {followerList.map((user) => (
                        <Card
                            key={user.USER_ID}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: 1.5,
                                border: '1px solid #000000ff',
                                borderRadius: 5,
                                boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.81)",
                                transition: 'transform 0.2s ease',
                                "&:hover": { transform: "scale(1.02)" },
                            }}
                            onClick={() => goToOtherUser(user)}
                        >
                            <Box sx={{ width: 50, height: 50, borderRadius: "50%", overflow: "hidden", mr: 2 }}>
                                <img
                                    src={user.PROFILE_IMG ? `http://localhost:3010${user.PROFILE_IMG}` : "/기본이미지.jpg"}
                                    alt={user.NICKNAME}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </Box>
                            <Box>
                                <Typography fontWeight="bold">{user.NICKNAME}</Typography>
                                <Typography color="text.secondary" fontSize={12}>
                                    @{user.USER_ID}
                                </Typography>
                            </Box>
                        </Card>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}

export default Friend;
