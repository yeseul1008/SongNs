import React, { useEffect, useRef, useState } from 'react';
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    IconButton,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";

const API_KEY = "78b9b4c52313949c2ce8178e0f9b9d46"; // Last.fm API Key

function EditPost() {
    const location = useLocation();
    const { postId } = location.state || {}; // 받아온 포스트아이디

    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);
    const contentRef = useRef();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [loading, setLoading] = useState(false);

    // 게시글 정보 불러오기
    useEffect(() => {
        if (!postId) return;

        const fetchPostDetail = async () => {
            try {
                const res = await fetch(`http://localhost:3010/feed/detail/${postId}`);
                const data = await res.json();
                if (res.ok && data.post) {
                    contentRef.current.value = data.post.CONTENT || "";
                    setSelectedTrack({
                        name: data.post.MUSIC_TITLE,
                        artist: data.post.SINGER,
                        url: data.post.LASTFM_TRACK_ID
                    });
                    if (data.post.IMAGE_URL) {
                        setPreviewUrl(data.post.IMAGE_URL); // 기존 이미지 미리보기
                    }
                }
            } catch (err) {
                console.error(err);
                alert("게시글 정보를 불러오지 못했습니다.");
            }
        };

        fetchPostDetail();
    }, [postId]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFiles([file]);
        setPreviewUrl(URL.createObjectURL(file));
    };

    // 노래 검색
    const handleSearch = async () => {
        if (!searchQuery) return;
        setLoading(true);

        try {
            const res = await fetch(
                `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(
                    searchQuery
                )}&api_key=${API_KEY}&format=json&limit=100&page=1`
            );
            const data = await res.json();
            const tracks = data.results.trackmatches.track;
            setSearchResults(tracks.slice(0, 100));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTrack = (track) => {
        setSelectedTrack(track);
        setSearchResults([]);
        setSearchQuery("");
    };

    // 게시글 수정
    const fnFeedAdd = async () => {
        const token = localStorage.getItem("token");
        if (!token) return alert("로그인 후 이용해주세요");

        const decoded = jwtDecode(token);
        if (!files.length && !previewUrl) return alert("이미지를 선택해주세요");
        if (!selectedTrack) return alert("노래를 선택해주세요");

        const formData = new FormData();
        if (files.length > 0) formData.append("file", files[0]);
        formData.append("userId", decoded.userId);
        formData.append("content", contentRef.current.value);
        formData.append("lastfmTrackId", selectedTrack.url);
        formData.append("title", selectedTrack.name);
        formData.append("singer", selectedTrack.artist);
        formData.append("postId", postId); // 수정할 게시글 ID

        try {
            const res = await fetch("http://localhost:3010/feed/postEdit", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (data.result === "success") {
                alert("게시글이 수정되었습니다!");
                navigate("/feedDetail", { state: { postId: postId } })
            } else {
                alert("수정 실패");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start"
                sx={{
                    backgroundColor: '#fff',
                    borderRadius: 4,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    padding: 3,
                    marginBottom: 10,
                    mt: 5,
                }}>
                <Typography variant="h4" gutterBottom>게시글 수정</Typography>

                {/* 이미지 미리보기 */}
                {previewUrl && (
                    <Box sx={{
                        width: 500,
                        height: 500,
                        border: '1px solid #ccc',
                        borderRadius: 2,
                        marginBottom: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'hidden',
                    }}>
                        <img src={previewUrl} alt="미리보기" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                )}

                {/* 파일 선택 */}
                <Box display="flex" alignItems="center" margin="normal" sx={{ marginBottom: 2, border: `1px solid #000000`, borderRadius: '50px' }}>
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="file-upload"
                        type="file"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="file-upload">
                        <IconButton
                            sx={{ color: '#000' }} 
                            component="span"
                        >
                            <PhotoCamera />
                        </IconButton>
                    </label>
                </Box>

                {/* Last.fm 노래 검색 */}
                <Box display="flex" gap={1} width="100%" marginBottom={2}>
                    <TextField
                        label="노래 검색"
                        variant="outlined"
                        fullWidth
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button
                        onClick={handleSearch}
                        variant="contained"
                        sx={{
                            backgroundColor: '#000',  // 검정 배경
                            color: '#fff',            // 글씨 흰색
                            '&:hover': {
                                backgroundColor: '#333', // 마우스 오버 시 조금 밝게
                            },
                            textTransform: 'none',     // 글씨 대문자 변환 제거
                        }}
                    >검색</Button>
                </Box>
                {loading && (
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', py: 2 }}>
                        <CircularProgress size={28} />
                    </Box>
                )}

                {/* 검색 결과 */}
                {searchResults.length > 0 && (
                    <List sx={{ maxHeight: 300, overflow: 'auto', width: '100%', mb: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                        {searchResults.map((track, idx) => (
                            <ListItem button key={idx} onClick={() => handleSelectTrack(track)}>
                                <ListItemText primary={`${track.name} - ${track.artist}`} />
                            </ListItem>
                        ))}
                    </List>
                )}

                {/* 선택된 노래 표시 */}
                {selectedTrack && (
                    <Typography sx={{ mb: 2 }}>
                        선택된 곡: {selectedTrack.name} - {selectedTrack.artist}
                    </Typography>
                )}

                {/* 게시글 내용 */}
                <TextField
                    inputRef={contentRef}
                    label="캡션 추가"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    multiline
                    rows={4}
                />

                {/* 수정 버튼 */}
                <Button onClick={fnFeedAdd} variant="contained" fullWidth sx={{
                    mt: 2,
                    backgroundColor: 'transparent',
                    border: '2px solid #000',
                    borderRadius: '50px',
                    boxShadow: 'none',
                    background: "linear-gradient(to bottom, #ffffff 0%, #97E646 100%)",
                    textTransform: 'none',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#000',
                    padding: '12px 0',
                    '&:hover': {
                        background: "linear-gradient(to bottom, #ffffff 0%, #b6f264 100%)",
                        boxShadow: 'none',
                    },
                }}
                >
                    수정 완료
                </Button>
            </Box>
        </Container>
    );
}

export default EditPost;
