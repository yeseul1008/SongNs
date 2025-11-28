import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Paper, Typography, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom"; // 추가

function Search() {
  const location = useLocation();
  const { query } = location.state || {};
  const [tracks, setTracks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 추가
  const itemsPerPage = 9;
  const pageGroupSize = 10;

  useEffect(() => {
    const fetchTracks = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3010/api/search?q=${query}`);
        const data = await res.json();
        const trackList = data?.tracks || [];
        setTimeout(() => {
          setTracks(trackList);
          setCurrentPage(1);
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchTracks();
  }, [query]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentTracks = tracks.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(tracks.length / itemsPerPage);
  const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);
  const startPage = currentGroup * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        padding: 3,
        marginTop: 3,
        minHeight: "80vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 1000,
          padding: 3,
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "70vh",
          borderRadius: 7,
          border: "1px solid #000000",
          boxShadow: "0px 5px 3px rgba(0, 0, 0, 0.81)",
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontSize: "1.5rem" }}>
          Search results for "{query}"
        </Typography>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
              gap: 1.5,
            }}
          >
            <CircularProgress size={50} sx={{ color: "#000000ff" }} />
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#000000ff" }}>
              Searching for songs...
            </Typography>
          </Box>
        ) : (
          <>
            {/* 검색 결과 그리드 */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", // 카드 크기 줄임
                gap: 1.5,
                width: "100%",
                minHeight: 500, // 최소 높이 약간 줄임
              }}
            >
              {currentTracks.map((track, idx) => (
                <Paper
                  key={idx}
                  elevation={0}
                  sx={{
                    padding: 1.5, // 카드 안쪽 padding 줄임
                    background: "#ffffff",
                    border: "1px solid #000000",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontSize: "1rem" }}>
                    {track.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
                    {track.artist}
                  </Typography>
                  {track.url && (
                    <Box sx={{ display: "flex", gap: 1, marginTop: 2 }}>
                      {/* Feed 버튼 */}
                      <Button
                        variant="outlined"
                        size="small"
                        // onClick={() => navigate("/feed")} // 클릭 시 feed 페이지 이동
                        sx={{
                          border: '2px solid #000',
                          borderRadius: '50px',
                          textTransform: 'none',
                          fontSize: '14px',
                          color: '#000',
                          fontWeight: 800,
                          background: "linear-gradient(to bottom, #ffffff 0%, #97E646 100%)",
                          "&:hover": {
                            background: "linear-gradient(to bottom, #ffffff 0%, #b6f264 100%)",
                            boxShadow: 'none',
                          }
                        }} onClick={() => {
                          navigate("/searchList", {
                            state: {
                              trackName: track.name,   // 노래 제목
                              artistName: track.artist // 가수 이름
                            }
                          });
                        }}
                      >
                        Feed
                      </Button>

                      {/* Listen 버튼 */}
                      <Button
                        variant="outlined"
                        size="small"
                        href={track.url}
                        target="_blank"
                        sx={{
                          border: '2px solid #000',
                          borderRadius: '50px',
                          textTransform: 'none',
                          fontSize: '14px',
                          color: '#000',
                          fontWeight: 800,
                          background: "linear-gradient(to bottom, #ffffff 0%, #97E646 100%)",
                          "&:hover": {
                            background: "linear-gradient(to bottom, #ffffff 0%, #b6f264 100%)",
                            boxShadow: 'none',
                          }
                        }}
                      >
                        Listen
                      </Button>
                    </Box>
                  )}

                </Paper>
              ))}
            </Box>

            {/* 페이지네이션 */}
            <Box sx={{ marginTop: 3, display: "flex", gap: 1, flexWrap: "wrap" }}>
              {startPage > 1 && (
                <Button
                  onClick={() => setCurrentPage(startPage - 1)}
                  sx={{
                    minWidth: 35,
                    minHeight: 35,
                    borderRadius: "50%",
                    fontWeight: "bold",
                    fontSize: "0.8rem",
                    border: "1px solid #000000ff",
                  }}
                >
                  {"<"}
                </Button>
              )}

              {pageNumbers.map((num) => (
                <Button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  sx={{
                    minWidth: 35,
                    minHeight: 35,
                    borderRadius: "50%",
                    fontWeight: "bold",
                    fontSize: "0.8rem",
                    color: num === currentPage ? "#000000ff" : "#000000",
                    background: num === currentPage
                      ? "linear-gradient(to bottom, #97E646 0%, #ffffff 100%)" // 현재 페이지 배경
                      : "linear-gradient(to bottom, #ffffff 0%, #FEFF66 100%)",
                    border: num === currentPage ? "2px solid #000000" : "1px solid #000000ff",
                    border: "1px solid #000000ff",
                    "&:hover": {
                      background: num === currentPage
                        ? "linear-gradient(to bottom, #7ac223 0%, #e6e6e6 100%)" // 현재 페이지 hover 시 조금 어둡게
                        : "linear-gradient(to bottom, #f0f0f0 0%, #f5f566 100%)", // 나머지 페이지 hover
                    },
                  }}
                >
                  {num}
                </Button>
              ))}

              {endPage < totalPages && (
                <Button
                  onClick={() => setCurrentPage(endPage + 1)}
                  sx={{
                    minWidth: 35,
                    minHeight: 35,
                    borderRadius: "50%",
                    fontWeight: "bold",
                    fontSize: "0.8rem",
                    border: "1px solid #000000ff",
                  }}
                >
                  {">"}
                </Button>
              )}
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
}

export default Search;
