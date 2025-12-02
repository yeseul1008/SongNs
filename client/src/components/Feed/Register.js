import React, { useRef, useState } from 'react';
import { CircularProgress } from "@mui/material";
import { ListItemButton } from '@mui/material';

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

import { useNavigate } from "react-router-dom";
const API_KEY = "78b9b4c52313949c2ce8178e0f9b9d46"; // Last.fm API Key

function Register() {
    const [files, setFiles] = useState([]);
    const contentRef = useRef();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const handleFileChange = (event) => {
        setFiles(event.target.files);
    };

    // 모든 검색 결과 가져오기
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

            setSearchResults(tracks.slice(0, 100)); // 혹시 100개 넘게 올 경우 강제 제한
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

    const fnFeedAdd = () => {
        const token = localStorage.getItem("token");
        if (!token) return alert("로그인 후 이용해주세요");

        const decoded = jwtDecode(token);
        if (files.length === 0) return alert("이미지를 선택해주세요");
        if (!selectedTrack) return alert("노래를 선택해주세요"); // 선택한 곡 없으면 경고

        const formData = new FormData();
        formData.append("file", files[0]);
        formData.append("userId", decoded.userId);
        formData.append("content", contentRef.current.value);

        formData.append("lastfmTrackId", selectedTrack.url);  // 음악 URL
        formData.append("title", selectedTrack.name);         // 곡 제목
        formData.append("singer", selectedTrack.artist);      // 가수 이름

        fetch("http://localhost:3010/feed/uploadAll", {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                alert("업로드 완료!");
                navigate("/mypage");
            })
            .catch(err => console.error(err));
    };

    return (
        <Container maxWidth="sm">
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start"
                sx={{
                    backgroundColor: '#fff',
                    borderRadius: 4,
                    border: "1px solid #000000",
                    boxShadow: "0px 5px 3px rgba(0, 0, 0, 0.81)",
                    padding: 3,
                    marginBottom: 10,
                    mt: 5,
                }}>
                <Typography variant="h4" gutterBottom>새 게시물</Typography>

                {/* 이미지 미리보기 */}
                {files.length > 0 && (
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
                        <img src={URL.createObjectURL(files[0])} alt="미리보기" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                )}

                {/* 파일 선택 버튼 */}
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
                            color: '#000',
                            border: '2px solid #000',
                            borderRadius: '50px',
                            background: "linear-gradient(to bottom, #ffffff 0%, #97E646 100%)",
                            '&:hover': {
                                background: "linear-gradient(to bottom, #ffffff 0%, #b6f264 100%)",
                                boxShadow: 'none'
                            },
                        }}
                    >검색</Button>
                </Box>
                {loading && (
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            py: 2
                        }}
                    >
                        <CircularProgress size={28} />
                    </Box>
                )}

                {/* 검색 결과 */}
                {searchResults.length > 0 && (
                    <List sx={{ maxHeight: 300, overflow: 'auto', width: '100%', mb: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                        {searchResults.map((track, idx) => (
                            <ListItemButton key={idx} onClick={() => handleSelectTrack(track)}>
                                <ListItemText primary={`${track.name} - ${track.artist}`} />
                            </ListItemButton>
                        ))}
                    </List>

                )}

                {/* 선택된 노래 표시 */}
                {selectedTrack && (
                    <Typography sx={{ mb: 2 }}>선택된 곡: {selectedTrack.name} - {selectedTrack.artist}</Typography>
                )}

                <TextField
                    inputRef={contentRef}
                    label="캡션 추가"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    multiline
                    rows={4}
                />

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
                        boxShadow: 'none'
                    },
                }}>
                    등록하기
                </Button>
            </Box>
        </Container>
    );
}

export default Register;
