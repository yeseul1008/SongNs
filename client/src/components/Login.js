import React, { useRef, useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from "@mui/material/styles";

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
  let userId = useRef();
  let pwd = useRef();

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
              <TextField inputRef={userId} label="Userid" variant="outlined" margin="normal" fullWidth disabled={isIdChecked} />

            </Box>
            {/* <TextField inputRef={userId} label="Userid" variant="outlined" margin="normal" fullWidth /> */}

            <TextField inputRef={pwd} label="Password" type="password" variant="outlined" margin="normal" fullWidth />


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

            >
              Login
            </Button>

            <Typography variant="body2" sx={{ mt: 1 }}>
              SongNS가 처음이신가요? <Link to="/join">회원가입</Link>
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default Join;
