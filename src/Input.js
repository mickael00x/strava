import React, { useState, createRef, useCallback } from "react";


export default function Input({value, onClickChange}) {
    const handleInputChange = useCallback((eventFunction) => {
        onClickChange(eventFunction);
        
        if(!isActive) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
        
    }, [onClickChange])



    const [isActive, setIsActive] = useState(false);

    const inputRef = createRef();

    return <div className="absciss-container">
            <input 
                className={ `${isActive ? "absciss-item absciss-item-active" : "absciss-item" }` }
                type="text" 
                isActive={isActive}
                value={ value }
                ref={ inputRef }    
                style= {{ width: value.length * 7 }}
                onClick={ handleInputChange }
            ></input>
            { isActive && <span onClick={ handleInputChange } className="absciss-item-cross">x</span>}
            </div>;
}