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


function FindPwd() {
    let navigate = useNavigate();
    let nickName = useRef();
    let mail = useRef();
    let userId = useRef();
    let newPwd = useRef();
    const [step, setStep] = useState(1);
    const [userIdValue, setUserIdValue] = useState(""); // 아이디 저장
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
                        {step === 1 && (
                            <>
                                <Typography variant="h4" gutterBottom>
                                    비밀번호 찾기
                                </Typography>
                                <Box display="flex" alignItems="center" width="100%" gap={1}>
                                    <TextField inputRef={nickName} label="Nickname" variant="outlined" margin="normal" fullWidth />
                                    <TextField
                                        inputRef={(el) => { userId.current = el }}
                                        label="Id"
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                    />
                                </Box>
                                {/* <TextField inputRef={userId} label="Userid" variant="outlined" margin="normal" fullWidth /> */}

                                <TextField inputRef={mail} label="Mail" type="password" variant="outlined" margin="normal" fullWidth />

                                <Button
                                    fullWidth
                                    onClick={() => {
                                        let param = {
                                            userId: userId.current.value,
                                            nickName: nickName.current.value,
                                            mail: mail.current.value
                                        };

                                        fetch("http://localhost:3010/user/findPwd", {
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
                                                    setUserIdValue(userId.current.value); // step2에서 사용할 userId 저장
                                                    setStep(2);                                                                                                
                                                } else {
                                                    alert("회원 정보를 찾을 수 없습니다. 다시 확인해주세요.");
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
                                    Find Password
                                </Button>
                            </>
                        )}
                        {step === 2 && (
                            <>
                                <Typography variant="h4" gutterBottom>
                                    새 비밀번호 설정
                                </Typography>
                                <TextField inputRef={newPwd} label="새 비밀번호" type="password" variant="outlined" margin="normal" fullWidth />
                                <TextField label="비밀번호 확인" type="password" variant="outlined" margin="normal" fullWidth />

                                <Button
                                    fullWidth
                                    onClick={() => {
                                        let param = {
                                            userId: userIdValue,
                                            newPwd: newPwd.current.value
                                        };
                                        // console.log(param);
                                        
                                        fetch("http://localhost:3010/user/updatePwd", {
                                            method: "POST",
                                            headers: { "Content-type": "application/json" },
                                            body: JSON.stringify(param)
                                        })
                                            .then(res => res.json())
                                            .then(data => {
                                                if (data.result) {
                                                    alert("비밀번호가 성공적으로 변경되었습니다.");
                                                    navigate("/login");
                                                } else {
                                                    alert("비밀번호 변경에 실패했습니다.");
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
                                    비밀번호 변경
                                </Button>
                            </>
                        )}
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            SongNS가 처음이신가요? <Link to="/join">회원가입</Link>
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            <Link to="/login" style={{ color: "#7abe36ff" }}>돌아가기</Link>
                        </Typography>


                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default FindPwd;
