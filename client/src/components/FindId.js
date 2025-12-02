import React, { useRef, useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link, useNavigate } from 'react-router-dom';

const joinTheme = createTheme({
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: "50px",
                    "& fieldset": {
                        borderColor: "#00000071",
                        borderWidth: "2px",
                    },

                },
            },
        },
    },
});


function FindId() {
    const [foundNickname, setFoundNickname] = useState("");
    const [foundId, setFoundId] = useState("");
    let navigate = useNavigate();
    let nickName = useRef();
    let mail = useRef();

    return (
        <ThemeProvider theme={joinTheme}>
            <Box
                sx={{
                    minHeight: '100vh',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Container
                    maxWidth="xs"
                    sx={{
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        borderRadius: 10,
                        padding: 5,
                        border: `2px solid #000000`,
                        boxShadow: "0px 10px 0px rgba(0, 0, 0, 0.81)"

                    }}
                >
                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                        <Typography variant="h4" gutterBottom>
                            아이디 찾기
                        </Typography>
                        <Box display="flex" alignItems="center" width="100%" gap={1}>
                            <TextField inputRef={nickName} label="Nickname" variant="outlined" margin="normal" fullWidth />

                        </Box>
                        {/* <TextField inputRef={userId} label="Userid" variant="outlined" margin="normal" fullWidth /> */}

                        <TextField inputRef={mail} label="Mail" type="password" variant="outlined" margin="normal" fullWidth />
                        {foundId && (
                            <Typography variant="body1" sx={{ mb: 2, fontWeight: 600, color: "#7abe36ff", marginTop : 2.5 }}>
                               {foundNickname} 님의 아이디는 아이디는 <strong>{foundId}</strong> 입니다.
                            </Typography>
                        )}
                        <Button
                            fullWidth
                            onClick={() => {
                                let param = {
                                    nickName: nickName.current.value,
                                    mail: mail.current.value
                                };

                                fetch("http://localhost:3010/user/findId", {
                                    method: "POST",
                                    headers: {
                                        "Content-type": "application/json"
                                    },
                                    body: JSON.stringify(param)
                                })
                                    .then(res => res.json())
                                    .then(data => {
                                        // console.log(data);
                                        if (data.result) {
                                            setFoundId(data.id);
                                            setFoundNickname(data.nickname);
                                        } else {
                                            setFoundId("");
                                            alert("등록되지 않은 아이디입니다.");
                                        }
                                    });
                            }}
                            sx={{
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
                            Find Id
                        </Button>

                        <Typography variant="body2" sx={{ mt: 1 }}>
                            SongNS가 처음이신가요? <Link to="/join">회원가입</Link>
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            <Link to="/login" style={{ color: "#7abe36ff" }}>돌아가기</Link> | <Link to="/findPwd" style={{ color: "#7abe36ff" }}>비밀번호 찾기</Link>
                        </Typography>


                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default FindId;
