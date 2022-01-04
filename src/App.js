import AuthorizeAPI from "./FetchActivities";
import "./App.css";
import {AnimatePresence, motion} from 'framer-motion/dist/framer-motion'
import { ChakraProvider } from '@chakra-ui/react'




function App({ Component }) {
  return (
    <ChakraProvider>
      <div className="App">
        <AuthorizeAPI />
      </div>
    </ChakraProvider>
  );
}

export default App;
