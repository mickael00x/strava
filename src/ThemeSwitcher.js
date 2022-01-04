import React from "react";
import { Button } from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/react';

const ThemeSwitcher = () => {
    const { colorMode, toggleColorMode } = useColorMode()
    return (
        <header>
        <Button onClick={toggleColorMode}>
            Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
        </Button>
        </header>
    )
}

export default ThemeSwitcher;