import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { Box, Card, Typography, Paper } from '@mui/material';
import { useNavigate } from "react-router-dom";

function LikeList() {
    const [likeList, setLikeList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const itemsPerPage = 6;


    const fnLikeList = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            try {
                const res = await fetch("http://localhost:3010/feed/likeList/" + decoded.userId);
                const data = await res.json();
                setLikeList(data.list);
            } catch (err) {
                console.error(err);
            }
        } else {
            alert("로그인 후 이용해주세요.");
            navigate("/");
        }
    };

    useEffect(() => {
        fnLikeList();
    }, []);

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = likeList.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(likeList.length / itemsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 2,
                gap: 3,
                marginTop: 1.5
            }}
        >
            {likeList.length === 0 ? (
                <Paper
                    sx={{
                        padding: 20,
                        borderRadius: 3,
                        textAlign: 'center',
                        backgroundColor: '#ffffff',
                        boxShadow: "0px 5px 3px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    <Typography variant="h6" color="text.secondary">
                        좋아요한 게시글이 없습니다.<br />
                        게시글에 좋아요를 눌러보세요.
                    </Typography>
                </Paper>
            ) : (
                <>
                    {/* 카드 그리드 */}
                    <Box
                        sx={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #000000ff',
                            borderRadius: 5,
                            boxShadow: "0px 5px 3px rgba(0, 0, 0, 0.81)",
                            padding: 4,
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: 2,
                            maxWidth: 900,
                        }}

                    >
                        {currentItems.map((item) => (
                            <Card
                                key={item.LIKE_ID}
                                sx={{
                                    width: 250,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    padding: 1.5,
                                    border: '1px solid #000000ff',
                                    borderRadius: 2,
                                    boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.81)",
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'transform 0.2s ease',
                                    "&:hover": {
                                        transform: "scale(1.02)",
                                    },
                                    "&::after": {
                                        content: '""',
                                        position: 'absolute',
                                        top: -50,
                                        left: -75,
                                        width: '50%',
                                        height: '200%',
                                        background: 'linear-gradient(120deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 80%)', // 불투명도를 0.7로 높임
                                        transform: 'rotate(25deg)',
                                        opacity: 0,
                                        transition: 'none',
                                    },
                                    "&:hover::after": {
                                        left: '120%',
                                        opacity: 1,
                                        transition: 'all 0.7s ease-in-out',
                                    },
                                }}
                                onClick={() => navigate("/feedDetail", { state: { postId: item.POST_ID } })}
                            >
                                <Box
                                    component="img"
                                    src={
                                        item.IMAGE_URL
                                            ? item.IMAGE_URL
                                            : item.LASTFM_TRACK_ID
                                                ? item.LASTFM_TRACK_ID
                                                : "/ummban.png"
                                    }
                                    alt={item.MUSIC_TITLE || "노래 이미지"}
                                    sx={{
                                        width: '100%',
                                        aspectRatio: '1/1',
                                        objectFit: 'cover',
                                        borderRadius: 1,
                                        marginBottom: 1,
                                    }}
                                />
                                <Typography
                                    fontWeight="bold"
                                    fontSize={14}
                                    textAlign="center"
                                    sx={{ overflowWrap: "break-word" }}
                                >
                                    {item.MUSIC_TITLE || "노래 제목"}
                                </Typography>
                                <Box sx={{ width: '100%', textAlign: 'center', mb: 1 }}>
                                    <Typography fontSize={12} color="text.secondary">
                                        {item.SINGER || "가수 이름"}
                                    </Typography>
                                </Box>
                            </Card>
                        ))}
                    </Box>

                    {/* 페이지네이션 버튼 */}
                    <Box sx={{ display: 'flex', gap: 2, mt: 2, alignItems: 'center' }}>
                        {/* 이전 */}
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                border: '1px solid #000000ff',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                boxShadow: "0px 3px 3px rgba(0,0,0,0.81)",
                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                filter: currentPage === 1 ? 'grayscale(100%)' : 'none',
                                transition: "transform 0.2s ease",
                                "&:hover": { transform: currentPage === 1 ? "none" : "scale(1.06)" },
                                "&:active": { transform: currentPage === 1 ? "none" : "scale(0.9)" },
                            }}
                            onClick={handlePrev}
                        >
                            <Box
                                component="img"
                                src="/Left.png"
                                alt="이전"
                                sx={{ width: '100%', height: '100%', display: 'block' }}
                            />
                        </Box>

                        <Typography>
                            {currentPage} / {totalPages}
                        </Typography>

                        {/* 다음 */}
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                border: '1px solid #000000ff',
                                overflow: 'hidden',
                                boxShadow: "0px 3px 3px rgba(0,0,0,0.81)",
                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                filter: currentPage === totalPages ? 'grayscale(100%)' : 'none',
                                transition: "transform 0.2s ease",
                                "&:hover": { transform: currentPage === totalPages ? "none" : "scale(1.06)" },
                                "&:active": { transform: currentPage === totalPages ? "none" : "scale(0.9)" },
                            }}
                            onClick={handleNext}
                        >
                            <Box
                                component="img"
                                src="/Right.png"
                                alt="다음"
                                sx={{ width: '100%', height: '100%', display: 'block' }}
                            />
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
}

export default LikeList;
