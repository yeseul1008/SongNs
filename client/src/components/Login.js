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


function Login() {
  const [isIdChecked, setIsIdChecked] = useState(false)
  let navigate = useNavigate();
  let userId = useRef();
  let pwd = useRef();

  const handleLogin = () => {
    const param = {
      userId: userId.current.value,
      pwd: pwd.current.value
    };

    fetch("http://localhost:3010/user/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(param)
    })
      .then(res => res.json())
      .then(data => {
        alert(data.msg);
        if (data.result) {
          localStorage.setItem("token", data.token);
          navigate("/feed");
        }
      });
  };


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
              Login
            </Typography>
            <Box display="flex" alignItems="center" width="100%" gap={1}>
              <TextField inputRef={userId} label="Id" variant="outlined" margin="normal" fullWidth disabled={isIdChecked} />

            </Box>
            {/* <TextField inputRef={userId} label="Userid" variant="outlined" margin="normal" fullWidth /> */}

            <TextField inputRef={pwd} label="Password" type="password" variant="outlined" margin="normal" fullWidth onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin(); // 로그인 버튼과 동일한 함수 호출
              }
            }} />


            <Button
              fullWidth
              onClick={() => {
                let param = {
                  userId: userId.current.value,
                  pwd: pwd.current.value
                };

                fetch("http://localhost:3010/user/login", {
                  method: "POST",
                  headers: {
                    "Content-type": "application/json"
                  },
                  body: JSON.stringify(param)
                })
                  .then(res => res.json())
                  .then(data => {
                    // console.log(data);
                    alert(data.msg);
                    if (data.result) {
                      localStorage.setItem("token", data.token);
                      navigate("/feed");
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
              Login
            </Button>

            <Typography variant="body2" sx={{ mt: 1 }}>
              SongNS가 처음이신가요? <Link to="/join">회원가입</Link>
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <Link to="/findId" style={{ color: "#7abe36ff" }}>아이디 찾기</Link> | <Link to="/findPwd" style={{ color: "#7abe36ff" }}>비밀번호 찾기</Link>
            </Typography>


          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default Login;
