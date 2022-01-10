import React from "react";
import { useColorMode, Button, IconButton } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

const ThemeSwitcher = () => {
    const { colorMode, toggleColorMode } = useColorMode()
    return (
        <header>
        
        <Button onClick={toggleColorMode}>
            {colorMode === "light" ? <FaSun /> : <FaMoon /> }
        </Button>
        </header>
    )
}

export default ThemeSwitcher;