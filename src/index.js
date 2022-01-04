import { ColorModeScript } from '@chakra-ui/react'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import theme from './theme'
import {AnimatePresence, motion} from 'framer-motion/dist/framer-motion'


ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

