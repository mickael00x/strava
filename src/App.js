import AuthorizeAPI from "./FetchActivities";
import "./App.css";
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
