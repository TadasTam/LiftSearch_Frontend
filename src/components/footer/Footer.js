import * as React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

export default function Footer() {
    return (
      <Paper sx={{marginTop: 'calc(10% + 60px)',
      width: '100%',
      position: 'fixed',
      bottom: 0,
      bgcolor : '#99c24d',
      }} component="footer" square variant="outlined">
        <Container maxWidth="lg">
          <Box
            sx={{
              flexGrow: 1,
              justifyContent: "center",
              display: "flex",
              my:1
            }}
          >
          </Box>
  
          <Box
            sx={{
              flexGrow: 1,
              justifyContent: "center",
              display: "flex",
              mb: 2,
            }}
          >
            <Typography variant="caption" color="initial">
              Saitynai ©2023
            </Typography>
          </Box>
        </Container>
      </Paper>
    );
  }