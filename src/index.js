import React from 'react';
//import { createRoot } from 'react-dom';
import * as ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Helvetica'
    ].join(','),
  },});

//const rootElement = document.getElementById('root');
//const root = createRoot(rootElement);
ReactDOM.render(
  <ThemeProvider theme={theme}>
    <App/>
  </ThemeProvider>,
  document.getElementById('root')
)



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
