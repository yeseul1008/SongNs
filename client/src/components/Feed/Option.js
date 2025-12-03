import React from 'react';
import { Box, Button } from '@mui/material';

function Option() {

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
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
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
                <Button
                    variant="contained"
                    color="error"
                    sx={{
                        mt: 2,
                        width: 300,
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
                    }}
                onClick={() => {
                    alert("준비중입니다.")
                    return;
                    
                  }}
                >
                    탈퇴하기
                </Button>
            </Box>
        </Box>
    );
}

export default Option;
