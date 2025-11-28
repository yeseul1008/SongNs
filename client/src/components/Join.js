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


function Join() {
  const [isIdChecked, setIsIdChecked] = useState(false)
  let navigate = useNavigate();
  let userId = useRef();
  let pwd = useRef();
  let pwdCheck = useRef();
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
              sign up
            </Typography>
            <Box display="flex" alignItems="center" width="100%" gap={1}>
              <TextField inputRef={userId} label="Userid" variant="outlined" margin="normal" fullWidth disabled={isIdChecked} />
              <Button // 아이디 중복체크
                sx={{
                  marginTop: 1,
                  whiteSpace: "nowrap",
                  height: "56px",
                  borderRadius: "50px",
                  border: "2px solid #000",
                  color: "#000",
                  backgroundColor: "transparent",
                  fontWeight: 600,
                  textTransform: "none",

                  "&:hover": {
                    background: "linear-gradient(to bottom, #ffffff 0%, #97E646 100%)",
                  },
                }}
                onClick={() => {
                  const idVal = userId.current.value;
                  const idRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{5,}$/;
                  if (!idRegex.test(idVal)) {
                    alert("아이디는 영문+숫자 포함 5자 이상이어야 합니다.");
                    return;
                  }
                  const param = {
                    userId: userId.current.value, // userId Ref
                  };
                  fetch("http://localhost:3010/user/checkId", {
                    method: "POST", // POST든 GET이든 서버에 맞춰
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(param),
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      // 서버에서 { result: true/false, msg: "..."} 반환 가정
                      alert(data.msg); // 예: "사용 가능한 아이디입니다."
                      if (data.result) {
                        setIsIdChecked(true); //  중복 체크 성공하면 비활성화
                      }
                    })
                    .catch((err) => {
                      console.error(err);
                      alert("서버 오류가 발생했습니다.");
                    });
                }}
              >
                Check ID
              </Button>
            </Box>
            {/* <TextField inputRef={userId} label="Userid" variant="outlined" margin="normal" fullWidth /> */}
            <TextField inputRef={nickName} label="Nickname" variant="outlined" margin="normal" fullWidth />
            <TextField inputRef={mail} label="Email" variant="outlined" margin="normal" fullWidth />
            <TextField inputRef={pwd} label="Password" type="password" variant="outlined" margin="normal" fullWidth />
            <TextField inputRef={pwdCheck} label="PasswordCheck" type="password" variant="outlined" margin="normal" fullWidth />

            <Button
              fullWidth
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
              onClick={() => {
                const idVal = userId.current.value;
                const pwdVal = pwd.current.value;


                if (!isIdChecked) {
                  alert("아이디 체크 후 다시 시도해주세요.")
                  return;
                }
                if (!nickName.current.value || !mail.current.value || !pwd.current.value || !pwdCheck.current.value) {
                  alert("닉네임, 이메일, 비밀번호를 모두 입력해주세요.");
                  return;
                }
                if (pwd.current.value !== pwdCheck.current.value) {
                  alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
                  return;
                }
                // 아이디 유효성 체크
                const idRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{5,}$/;
                if (!idRegex.test(idVal)) {
                  alert("아이디는 영문+숫자 포함 5자 이상이어야 합니다.");
                  return;
                }

                // 비밀번호 유효성 체크
                const pwdRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{5,}$/;
                if (!pwdRegex.test(pwdVal)) {
                  alert("비밀번호는 영문+숫자 포함 5자 이상이어야 합니다.");
                  return;
                }
                let param = {
                  userId: userId.current.value,
                  pwd: pwd.current.value,
                  nickName: nickName.current.value,
                  mail: mail.current.value
                };

                fetch("http://localhost:3010/user/join", {
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
                    navigate("/");
                  })

              }}
            >
              sign up
            </Button>

            <Typography variant="body2" sx={{ mt: 1 }}>
              이미 회원이라면? <Link to="/login">로그인</Link>
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default Join;
